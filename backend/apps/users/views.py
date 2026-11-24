from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from ..users.serializers import UserSerializer
from .services import (
    InvalidResetTokenError,
    confirm_password_reset,
    send_password_reset_for_email,
)

User = get_user_model()


class RequestPasswordResetView(APIView):
    """
    View to request a password reset email.
    """

    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email", "")
        send_password_reset_for_email(email)

        return Response(
            {
                "detail": "If an account exists with that email, a password reset link has been sent."
            }
        )


class ConfirmPasswordResetView(APIView):
    # Allow unauthenticated access
    permission_classes = [AllowAny]
    # Prevent DRF from throwing 401s if an invalid/expired token header is present
    authentication_classes = []

    def post(self, request):
        uid = request.data.get("uid", "")
        token = request.data.get("token", "")
        new_password = request.data.get("new_password", "")

        try:
            confirm_password_reset(uid=uid, token=token, new_password=new_password)
        except InvalidResetTokenError as exc:
            return Response(
                {"detail": str(exc)},
                status=status.HTTP_400_BAD_REQUEST,
            )
        except ValidationError as exc:
            return Response(
                {"new_password": list(exc.messages)},
                status=status.HTTP_400_BAD_REQUEST,
            )

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
    search_fields = ["username", "email"]  # Enable partial searching via ?search=
    ordering_fields = ["date_joined", "username"]

    def get_permissions(self):
        """
        Instiated and returns the list of permissions that this view required.
        """
        if self.action in ["create"]:
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAuthenticated]

        return [permission() for permission in permission_classes]

    @action(detail=False, methods=["get"], permission_classes=[IsAuthenticated])
    def me(self, request):
        """
        Returns the current user
        """
        serializer = UserSerializer(request.user)
        return Response(serializer.data)
