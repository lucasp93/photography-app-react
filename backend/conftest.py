import pytest
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient

User = get_user_model()

# ------------------------------------------------------------------
# Database & Client Fixtures
# ------------------------------------------------------------------


@pytest.fixture(autouse=True)
def enable_db_access(db):
    """
    Automatically grants database access to all tests without needing
    @pytest.mark.django_db on every single function.
    """
    pass


@pytest.fixture
def api_client():
    """Provides a fresh, unauthenticated DRF APIClient."""
    return APIClient()


# ------------------------------------------------------------------
# User Factories
# ------------------------------------------------------------------


@pytest.fixture
def user_factory():
    """
    Factory fixture to create users with custom attributes on demand.
    Usage: create_factory(username="custom", role="admin")
    """

    def _make_user(**kwargs):
        defaults = {
            "username": "testuser",
            "email": "testuser@example.com",
            "password": "Password123!",
            "role": "user",
        }
        # Override defaults with provided keyword arguments
        defaults.update(kwargs)
        return User.objects.create_user(**defaults)

    return _make_user


@pytest.fixture
def regular_user(user_factory):
    """Returns a standard user instance."""
    return user_factory(username="standar_user", email="user@example", role="user")

@pytest.fixture
def admin_user(user_factory):
    """Returns an admin user instance."""
    return user_factory(username="admin_user", email="admin@example", role="admin")

# ------------------------------------------------------------------
# Authenticated Client Fixtures
# ------------------------------------------------------------------

@pytest.fixture
def auth_client(api_client, regular_user):
    """
    Returns an APIClient pre-authenticated as a regular user using force_authenticate.
    Bypass token generation overhead for fast testing.
    """
    api_client.force_authenticate(user=regular_user)
    return api_client

@pytest.fixture
def admin_client(api_client, admin_user):
    """Returns an APIClient pre-authenticated as an admin user."""
    api_client.force_authenticate(user=admin_user)
    return api_client

# ------------------------------------------------------------------
# JWT / Token Authentication Fixture (Optional)
# ------------------------------------------------------------------

@pytest.fixture
def jwt_auth_client(api_client, regular_user):
    """
    Simulates a real JWT authorization header using djangorestframework-simplejwt.
    Useful when testing token-specific middleware or full request lifecycles.
    """

    from rest_framework_simplejwt.tokens import RefreshToken
    refresh = RefreshToken.for_user(regular_user)
    api_client.credentials(HTTP_AUTHORIZATION=f"Bearer {refresh.access_token}")
    return api_client