from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    ROLE_CHOICES = (
        ("admin", "Admin"),
        ("editor", "Editor"),
        ("user", "User"),
    )

    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default="user")
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
            db_table = "users"
            ordering = ["-date_joined"]

    def __str__(self):
        return f"{self.username} ({self.role})"

    def to_dict(self):
        return {
            "id": self.id,
            "username": self.username,
            "role": self.role,
            "email": self.email,
            "created_at": self.created_at.isoformat(), # Include for consistency with serializer
            "updated_at": self.updated_at.isoformat(), # Include for consistency with serializer
        }
