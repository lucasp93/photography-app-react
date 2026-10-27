from django.conf import settings
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth.tokens import default_token_generator
from django.db import transaction
from django.core.exceptions import ValidationError
from django.utils.encoding import force_bytes, force_str
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import status, viewsets
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from ..tasks import send_password_reset_email_task
from ..users.models import User
from ..users.serializers import UserSerializer

User = get_user_model()

@api_view(["POST"])
@permission_classes([AllowAny])
def request_password_reset(request):
    email = request.data.get("email", "").strip()
    user = User.objects.filter(email__iexact=email).first() if email else None

    if user:
        transaction.on_commit(
            lambda: send_password_reset_email_task.delay(user.pk)
        )

    return Response(
        {"detail": "If an account exists for that email, a reset link will be sent."},
        status=status.HTTP_202_ACCEPTED,
    )

class RequestPasswordResetView(APIView):
    """
    View to request a password reset email.
    """
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email", "").strip()

        try:
            user = User.objects.get(email=email)
            uuid = urlsafe_base64_encode(force_bytes(user.pk))
            token = default_token_generator.make_token(user)

            # Construct frontend react url
            frontend_base = settings.FRONTEND_URL.rstrip('/')
            reset_url = f"{frontend_base}/password/reset/confirm/{uuid}/{token}"
            # Dispatch email dispatch task to Celery worker
            send_password_reset_email_task.delay(user.email, reset_url)
        except User.DoesNotExist:
            # Prevent user enumeration by returning a generic response
            pass

        return Response({"detail": "If an account exists with that email, a password reset link has been sent."})


class ConfirmPasswordResetView(APIView):
    # Allow unauthenticated access
    permission_classes = [AllowAny]
    # Prevent DRF from throwing 401s if an invalid/expired token header is present
    authentication_classes = []

    def post(self, request):
        uid = request.data.get("uid", "")
        token = request.data.get("token", "")
        new_password = request.data.get("new_password", "")

        if not uid or not token or not new_password:
            return Response(
                {"detail": "UID, token, and new password are required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            user_id = force_str(urlsafe_base64_decode(uid))
            user = User.objects.get(pk=user_id)
        except (TypeError, ValueError, OverflowError, UnicodeDecodeError, User.DoesNotExist):
            user = None

        if user is None or not default_token_generator.check_token(user, token):
            return Response(
                {"detail": "This password reset link is invalid or has expired."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            validate_password(new_password, user=user)
        except ValidationError as exc:
            return Response(
                {"new_password": list(exc.messages)},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user.set_password(new_password)
        user.save(update_fields=["password"])
        return Response({"detail": "Password has been reset successfully."})

class UserViewSet(viewsets.ModelViewSet):
    """
    Standard CRUD actions for Users
    """

    permission_classes = [IsAuthenticated]

    queryset = User.objects.all().order_by("id")
    serializer_class = UserSerializer

    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ["username", "email", "role", "last_login"]
    search_fields = ["username", "email"] # Enable partial searching via ?search=
    ordering_fields = ["date_joined", "username"]

    def get_permissions(self):
        """
        Instiated and returns the list of permissions that this view required. 
        """
        if self.action in ["list", "retrieve"]:
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAuthenticated]

        return [permission() for permission in permission_classes]

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def me(self, request):
        """
        Returns the current user
        """
        serializer = UserSerializer(request.user)
        return Response(serializer.data)
