from rest_framework import serializers
from ..photos.models import Photo


class PhotoSerializer(serializers.ModelSerializer):
    orders = serializers.PrimaryKeyRelatedField(many=True, read_only=True)
    album_name = serializers.CharField(source="album.name", read_only=True)
    album_author = serializers.CharField(source="album.author", read_only=True)

    class Meta:
        model = Photo
        fields = [
            "id",
            "name",
            "author",
            "featured",
            "url",
            "album",
            "album_name",
            "album_author",
            "orders",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]

