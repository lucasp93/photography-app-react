from django.db import transaction
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets
from rest_framework.filters import OrderingFilter, SearchFilter
from ..orders.models import Order
from ..orders.serializers import OrderSerializer
from rest_framework.permissions import AllowAny, IsAdminUser, IsAuthenticated
from ..notifications import notify_order_created


class OrderViewSet(viewsets.ModelViewSet):
    """
    Order standard actions
    """

    permission_classes = [IsAuthenticated]

    queryset = Order.objects.all().order_by("id")
    serializer_class = OrderSerializer

    # Enable built-in filtering, search, and ordering
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ["order_number", "client_name", "client_email"]
    search_fields = ["order_number", "client_name", "client_email"]
    ordering_fields = ["created_at", "price"]

    def get_permissions(self):
        # Allow anyone to create an order (guest checkout)
        if self.action == "create":
            return [AllowAny()]
        return [IsAdminUser()]

    def perform_create(self, serializer):
        # Save the order instance to the database
        order = serializer.save()

        # Delay task execution until the DB transaction commits
        transaction.on_commit(lambda: notify_order_created(order.id))
