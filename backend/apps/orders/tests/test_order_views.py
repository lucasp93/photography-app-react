from django.urls import reverse
from rest_framework import status
from apps.orders.models import Order
from django.utils import timezone


def test_list_orders(jwt_auth_client):
    Order.objects.create(
        order_number="ORD-5231",
        client_name="John Doe",
        client_email="john@example.com",
        client_contact="+33612345678",
        price=200,
        created_at=timezone.now(),
        updated_at=timezone.now(),
    )

    Order.objects.create(
        order_number="ORD-5678",
        client_name="Jane Doe",
        client_email="jane@example.com",
        client_contact="+33612345678",
        price=100,
        created_at=timezone.now(),
        updated_at=timezone.now(),
    )

    url = reverse("order-list")
    response = jwt_auth_client.get(url)

    assert response.status_code == status.HTTP_200_OK
    assert len(response.data) == 2


def test_create_order(jwt_auth_client):
    url = reverse("order-list")
    payload = {
        "order_number": "ORD-1234",
        "client_name": "John Doe",
        "client_email": "john@example.com",
        "client_contact": "+33612345678",
        "price": 200,
    }
    response = jwt_auth_client.post(url, payload, format="json")

    assert response.status_code == status.HTTP_201_CREATED
    assert Order.objects.filter(order_number="ORD-1234").exists()


def test_filter_or_search_orders(jwt_auth_client):
    Order.objects.create(
        order_number="ORD-4321",
        client_name="Tom Joe",
        client_email="tom@example.com",
        client_contact="+33612345678",
        price=50,
        created_at=timezone.now(),
        updated_at=timezone.now(),
    )

    url = reverse("order-list")
    response = jwt_auth_client.get(f"{url}?search=Joe")

    assert response.status_code == status.HTTP_200_OK
    assert len(response.data) == 1
    assert response.data[0]["client_name"] == "Tom Joe"
