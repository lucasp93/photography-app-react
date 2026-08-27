import pytest
from django.urls import reverse
from rest_framework import status
from apps.users.models import User

@pytest.fixture
def api_client():
    from rest_framework.test import APIClient

    return APIClient()

@pytest.fixture
def create_user(db):
    from django.contrib.auth import get_user_model

    User = get_user_model()

    def _create_user(username="johndoe", email="john@example.com", role="user"):
        return User.objects.create_user(
            username=username, email=email, role=role
        )

    return _create_user

@pytest.mark.django_db
def test_list_users(api_client, create_user):
    create_user(username="user1", email="user1@example.com")
    create_user(username="user2", email="user2@example.com")

    url = reverse("user-list")
    # Create user
    user = User.objects.create_user(
        email="test@example.com",
        username="test1",
        password="test123",
    )
    # Authenticate the client
    api_client.force_authenticate(user=user)
    response = api_client.get(url)

    assert response.status_code == status.HTTP_200_OK
    assert len(response.data) == 3

@pytest.mark.django_db
def test_search_user_by_username(api_client, create_user):
    create_user(username="photographer", email="photo@example.com")
    create_user(username="client", email="client@example.com")

    url = reverse("user-list")
    # Create user
    user = User.objects.create_user(
        email="test@example.com",
        username="test1",
        password="test123",
    )
    # Authenticate the client
    api_client.force_authenticate(user=user)
    response = api_client.get(f"{url}?search=photo")

    assert response.status_code == status.HTTP_200_OK
    assert len(response.data) == 1
    assert response.data[0]["username"] == "photographer"
