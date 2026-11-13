from django.db import transaction
from rest_framework import viewsets
from rest_framework.filters import OrderingFilter, SearchFilter
from ..orders.models import Order
from ..orders.serializers import OrderSerializer
from rest_framework.permissions import AllowAny, IsAdminUser, IsAuthenticated
from ..tasks import send_order_confirmation_email


class OrderViewSet(viewsets.ModelViewSet):
    """
    Order standard actions
    """

    permission_classes = [IsAuthenticated]


    queryset = Order.objects.all().order_by("id")
    serializer_class = OrderSerializer

    # Enable buit-in search and ordering
    filter_backends = [SearchFilter, OrderingFilter]
    filterset_fields = ["order_number", "client_name", "client_email"]
    search_fields = ["order_number", "client_name", "client_email"]
    ordering_fields = ["created_at", "price"]

    def get_permissions(self):
        # Allow anyoneto create an order (guess checkout)
        if self.action == 'create':
            return [AllowAny()]
        return [IsAdminUser()]

    def get_queryset(self):
        queryset = super().get_queryset()
        order_number = self.request.query_params.get("order_number")
        client_name = self.request.query_params.get("client_name")
        client_email = self.request.query_params.get("client_email")
        if order_number:
            queryset = queryset.filter(order_number=order_number)
        if client_name:
            queryset = queryset.filter(client_name=client_name)
        if client_email:
            queryset = queryset.filter(client_email=client_email)
        return queryset

    def perform_create(self, serializer):
        # Save the order instance to the database
        order = serializer.save()

        # Delay task execution until the DB transaction commits
        transaction.on_commit(
            lambda: send_order_confirmation_email.delay(order.id)
        )
