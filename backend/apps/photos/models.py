from django.db import models
from django.conf import settings
from ..albums.models import Album
from ..orders.models import Order
from ..users.models import User


class Photo(models.Model):
    name = models.CharField(max_length=100)
    author = models.CharField(max_length=100)
    featured = models.BooleanField(default=False)
    url = models.URLField(max_length=200)
    album = models.ForeignKey(Album, on_delete=models.CASCADE, related_name="photos")
    orders = models.ManyToManyField(Order, related_name="photos", blank=True)
    favorited_by = models.ManyToManyField(
        #User,
        settings.AUTH_USER_MODEL,
        related_name="favorite_photos",
        blank=True,
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

    def to_dict(self, request=None):
        # Check if the requesting user has favorited
        is_favorited = False
        if request and request.user.is_authenticated:
            is_favorited = self.favorited_by.filter(pk=request.user.pk).exists()
        return {
            "id": self.id,
            "name": self.name,
            "author": self.author,
            "featured": self.featured,
            "url": self.url,
            "album_name": self.album.name,
            "album_id": self.album.id,
            "is_favorited": is_favorited,
            "created_at": self.created_at.isoformat(),  # Include for consistency with serializer
            "updated_at": self.updated_at.isoformat(),  # Include for consistency with serializer
        }
