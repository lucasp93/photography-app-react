import pytest
from apps.users.serializers import UserSerializer


@pytest.mark.django_db
def test_serializer_valid_data():
    valid_payload = {
        "username": "johndoe",
        "email": "john@example.com",
        "role": "editor",
    }
    serializer = UserSerializer(data=valid_payload)

    assert serializer.is_valid()
    assert serializer.validated_data["username"] == "johndoe"
    assert serializer.validated_data["role"] == "editor"

@pytest.mark.django_db
def test_serializer_read_only_fields(user_factory):
    user = user_factory(username="existinguser")
    serializer = UserSerializer(user)

    # Verify output formatting
    assert "id" in serializer.data
    assert "date_joined" in serializer.data
    assert serializer.data["username"] =="existinguser"