from django.db import models

from ..albums.models import Album
from ..orders.models import Order


class Photo(models.Model):
    name = models.CharField(max_length=100)
    author = models.CharField(max_length=100)
    featured = models.BooleanField(default=False)
    url = models.URLField(max_length=200)
    album = models.ForeignKey(Album, on_delete=models.CASCADE, related_name="photos")
    order = models.ForeignKey(
        Order, on_delete=models.CASCADE, related_name="photos", null=True, blank=True
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "photos"
        ordering = ["-created_at"]

        # Enforce name uniqueness scoped per album instead of globally
        constraints = [
            models.UniqueConstraint(
                fields=["album", "name"], name="unique_photo_name_per_album"
            )
        ]

    def __str__(self):
        return f"{self.name} (Album: {self.album.name})"

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "author": self.author,
            "featured": self.featured,
            "url": self.url,
            "album_id": self.album.id,
            "created_at": self.created_at.isoformat(),  # Include for consistency with serializer
            "updated_at": self.updated_at.isoformat(),  # Include for consistency with serializer
        }
