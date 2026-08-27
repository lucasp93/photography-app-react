import pytest
from django.contrib.auth import get_user_model

User = get_user_model()

@pytest.mark.django_db
def test_create_user_with_default_role():
    user = User.objects.create_user(
        username="testuser",
        email="test@email.com",
        password="test123",
    )

    assert user.role == "user"
    assert str(user) == "testuser (user)"

@pytest.mark.django_db
def test_custom_role_assigment():
    admin_user = User.objects.create_user(
        username="adminuser",
        email="admin@email.com",
        password="admin123",
        role="admin",
    )

    assert admin_user.role == "admin"
    assert str(admin_user) == "adminuser (admin)"
