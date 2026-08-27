from django.db import models

class Album(models.Model):
    EVENT_CHOICES = (
        ("wedding", "Wedding"),
        ("birthday", "Birthday"),
        ("family", "Family"),
        ("business", "Business"),
        ("maternity", "Maternity"),
        ("newborn", "Newborn"),
    )

    name = models.CharField(max_length=100, unique=True)
    event = models.CharField(max_length=20, choices=EVENT_CHOICES)
    author = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "albums"
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.name} ({self.event})"

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "event": self.event,
            "author": self.author,
            "created_at": self.created_at.isoformat(), # Include for consistency with serializer
            "updated_at": self.updated_at.isoformat(), # Include for consistency with serializer
        }

