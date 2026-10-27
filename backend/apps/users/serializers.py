from rest_framework import serializers
from ..users.models import User


class UserSerializer(serializers.ModelSerializer):
    role = serializers.ChoiceField(
        choices=User.ROLE_CHOICES,
        error_messages={"invalid_choice": "Invalid role. Must be one of: admin, editor, user"}
    )

    class Meta:
        model = User
        fields = ["id", "username", "role", "email", "first_name", "last_name", "password", "date_joined", "updated_at", "last_login"]
        read_only_fields = ["id", "date_joined", "updated_at"]

    def create(self, validated_data):
        # Extract password from validated_data
        password = validated_data.pop("password", None)

        # Instantiate user without raw password
        user = self.Meta.model(**validated_data)

        if password:
            # hash password
            user.set_password(password)
        user.save()
        return user