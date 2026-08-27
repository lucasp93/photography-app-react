from rest_framework import serializers
from ..users.models import User


class UserSerializer(serializers.ModelSerializer):
    role = serializers.ChoiceField(
        choices=User.ROLE_CHOICES,
        error_messages={"invalid_choice": "Invalid role. Must be one of: admin, editor, user"}
    )

    class Meta:
        model = User
        fields = ["id", "username", "role", "email", "date_joined", "updated_at"]
        read_only_fields = ["id", "date_joined", "updated_at"]
