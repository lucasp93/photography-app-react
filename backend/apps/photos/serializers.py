from rest_framework import serializers
from ..photos.models import Photo


class PhotoSerializer(serializers.ModelSerializer):
    orders = serializers.PrimaryKeyRelatedField(many=True, read_only=True)

    class Meta:
        model = Photo
        fields = [
            "id",
            "name",
            "author",
            "featured",
            "url",
            "album",
            "orders",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]

