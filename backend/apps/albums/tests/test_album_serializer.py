from apps.albums.serializers import AlbumSerializer
from apps.albums.models import Album

def test_serializer_valid_data():
    valid_payload = {
        "name": "Test Album",
        "event": "wedding",
        "author": "test_author",
    }
    serializer = AlbumSerializer(data=valid_payload)

    assert serializer.is_valid()
    assert serializer.validated_data["name"] == "Test Album"
    assert serializer.validated_data["event"] == "wedding"
    assert serializer.validated_data["author"] == "test_author"

def test_album_serializer_invalid_event_choise():
    payload = {
        "name": "Invalid Event",
        "event": "concert",
        "author": "Jane Doe"
    }
    serializer = AlbumSerializer(data=payload)

    assert not serializer.is_valid()
    assert "event" in serializer.errors

def test_serializer_read_only_fields():
    album = Album.objects.create(name="Family album", event="family", author="Sarah")
    serializer = AlbumSerializer(instance=album)

    # Verify output formatting
    assert "id" in serializer.data
    assert "created_at" in serializer.data
    assert "updated_at" in serializer.data
    assert serializer.data["name"] == "Family album"