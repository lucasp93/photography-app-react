from rest_framework import serializers
from  ..albums.models import Album


class AlbumSerializer(serializers.ModelSerializer):
    event = serializers.ChoiceField(
        choices=Album.EVENT_CHOICES,
        error_messages={"invalid_choice": "Invalid event choise."}
    )

    class Meta:
        model = Album
        fields = ["id", "name", "event", "author", "created_at", "updated_at"]
        read_only_fields = ["id", "created_at", "updated_at"]
