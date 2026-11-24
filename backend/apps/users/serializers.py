from django.db.models import Q
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
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


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """Allow authentication using either username or email."""

    def validate(self, attrs):
        identifier = attrs.get(self.username_field, "").strip()
        user = User.objects.filter(
            Q(username=identifier) | Q(email__iexact=identifier)
        ).first()
        if user:
            attrs[self.username_field] = user.username
        return super().validate(attrs)