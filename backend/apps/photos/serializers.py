from rest_framework import serializers
from ..photos.models import Photo
from ..albums.models import Album


class PhotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Photo
        fields = [
            "id",
            "name",
            "author",
            "featured",
            "url",
            "album",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]

    def representation(self, instance):
        representation = super().to_representation(instance)
        representation["album"] = {
            "id": instance.album.id,
            "name": instance.album.name,
        }

        if instance.order:
            representation["order"] = {
                "id": instance.order.id,
                "order_number": instance.order.order_number,
                "client_name": instance.order.client_name,
                "client_email": instance.order.client_email,
                "client_contact": instance.order.client_contact,
                "price": instance.order.price,
            }

        return representation
