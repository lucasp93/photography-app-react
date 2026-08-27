import pytest
from apps.orders.models import Order
from django.db import IntegrityError
from django.utils import timezone

@pytest.fixture
def order(db):
    """Creates and returns a simple Order instances."""
    return Order.objects.create(
        order_number="ORD-1234",
        client_name="John Doe",
        client_email="john@example.com",
        client_contact="+33612345678",
        price=200,
        created_at=timezone.now(),
        updated_at=timezone.now()
    )

@pytest.mark.django_db
class TestOrderModel:
    def test_create_order_with_valid_data(self, order):
        """Test that an order is successfully create with correct attributes."""
        assert Order.objects.count() == 1
        assert order.order_number == "ORD-1234"
        assert order.client_name == "John Doe"
        assert order.client_email == "john@example.com"
        assert order.client_contact == "+33612345678"
        assert order.price == 200
        assert order.created_at is not None
        assert order.updated_at is not None

    def test_uniquer_order_number_constraint(self, order):
        """Test that creating a second order with an existing order number raises IntegrityError."""
        with pytest.raises(IntegrityError):
            Order.objects.create(
                order_number="ORD-1234",
                client_name="Jane Doe",
                client_email="jane@example.com",
                client_contact="+33612345678",
                price=100,
                created_at=timezone.now(),
                updated_at=timezone.now(),
            )

    def test_auto_now_and_auto_now_add(self, order):
        """Test that created_at stays fixed while updated_at refreshes on save."""
        initial_created_at = order.created_at
        initial_updated_at = order.updated_at

        # Update a field and save
        order.client_name = "Charles Doe"
        order.save()

        order.refresh_from_db()
        assert order.created_at == initial_created_at
        assert order.updated_at > initial_updated_at
