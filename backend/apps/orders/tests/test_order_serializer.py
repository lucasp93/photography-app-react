from apps.orders.serializers import OrderSerializer
from apps.orders.models import Order


def test_serializer_valid_data():
    valid_payload = {
        "order_number": "ORD-1234",
        "client_name": "John Doe",
        "client_email": "john@example.com",
        "client_contact": "+33612345678",
        "price": 200,
    }
    serializer = OrderSerializer(data=valid_payload)
    assert serializer.is_valid()
    assert serializer.validated_data["client_name"] == "John Doe"
    assert serializer.validated_data["client_email"] == "john@example.com"
    assert serializer.validated_data["client_contact"] == "+33612345678"
    assert serializer.validated_data["price"] == 200.00

def test_order_serializer_invalid_order_number_choise():
    payload = {
        "order_number": "67890",
        "client_name": "John Doe",
        "client_email": "john@example.com",
        "client_contact": "+33612345678",
        "price": 200,
    }
    serializer = OrderSerializer(data=payload)
    print(serializer.is_valid())
    assert not serializer.is_valid()
    assert "order_number" in serializer.errors

def test_serializer_read_only_fields():
    order = Order.objects.create(
        order_number="ORD-1233",
        client_name="John Doe",
        client_email="john@example.com",
        client_contact="+33612345678",
        price=200.55,
    )

    serializer = OrderSerializer(instance=order)
    # Verify output formatting
    #assert "id" in serializer.data
    assert "created_at" in serializer.data
    assert "updated_at" in serializer.data
    assert serializer.data["order_number"] == "ORD-1233"
    assert serializer.data["client_name"] == "John Doe"
    assert serializer.data["client_email"] == "john@example.com"
    assert serializer.data["client_contact"] == "+33612345678"
    assert float(serializer.data["price"]) == 200.55