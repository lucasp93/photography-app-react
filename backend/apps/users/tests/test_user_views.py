import pytest
from django.contrib.auth.tokens import default_token_generator
from django.urls import reverse
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode
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


@pytest.mark.django_db
def test_confirm_password_reset_changes_password(api_client, create_user):
    user = create_user()
    user.set_password("old-password-93!")
    user.save(update_fields=["password"])
    uid = urlsafe_base64_encode(force_bytes(user.pk))
    token = default_token_generator.make_token(user)

    response = api_client.post(
        reverse("password-reset-confirm"),
        {"uid": uid, "token": token, "new_password": "new-password-94!"},
        format="json",
    )

    user.refresh_from_db()
    assert response.status_code == status.HTTP_200_OK
    assert user.check_password("new-password-94!")
    assert not user.check_password("old-password-93!")


@pytest.mark.django_db
def test_confirm_password_reset_rejects_invalid_token(api_client, create_user):
    user = create_user()
    user.set_password("old-password-93!")
    user.save(update_fields=["password"])
    uid = urlsafe_base64_encode(force_bytes(user.pk))

    response = api_client.post(
        reverse("password-reset-confirm"),
        {"uid": uid, "token": "invalid-token", "new_password": "new-password-94!"},
        format="json",
    )

    user.refresh_from_db()
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert user.check_password("old-password-93!")
