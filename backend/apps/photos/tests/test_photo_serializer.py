import pytest
from apps.photos.models import Photo
from apps.photos.serializers import PhotoSerializer
from apps.albums.models import Album


def test_photo_serializer_valid_payload(db):
    album = Album.objects.create(
        name="Birthday Party",
        event="birthday",
        author="Mark",
    )

    payload = {
        "name": "Cake Cutting",
        "author": "Mark",
        "featured": True,
        "url": "https://picsum.photos/id/231/1200/800.jpg",
        "album": album.id,
    }

    serializer = PhotoSerializer(data=payload)
    assert serializer.is_valid(), serializer.errors
    assert serializer.validated_data["album"] == album


def test_photo_serializer_missing_required_album(db):
    """Ensures serializer invalidates payload when required 'album' is missing"""
    payload = {
        "name": "Missing Album Photo",
        "author": "Mark",
        "url": "https://picsum.photos/id/231/1200/800.jpg",
    }

    serializer = PhotoSerializer(data=payload)

    assert not serializer.is_valid()
    assert "album" in serializer.errors


def test_photo_serializer_non_existent_album_id(db):
    """Ensures serializer rejects primary key IDs that do not exist in the database."""
    payload = {
        "name": "Invalid Album Photo",
        "author": "Mark",
        "url": "https://picsum.photos/id/231/1200/800.jpg",
        "album": 99999,  # Non-existent ID
    }

    serializer = PhotoSerializer(data=payload)

    assert not serializer.is_valid()
    assert "album" in serializer.errors


def test_photo_serializer_scoped_unique_constraint(db):
    album = Album.objects.create(name="Maternity", event="maternity", author="Sarah")
    Photo.objects.create(
        name="Portrait", author="Sarah", url="https://example.com/p1.jpg", album=album
    )
    payload = {
        "name": "Portrait",
        "author": "Sarah",
        "url": "https://example.com/p1.jpg",
        "album": album.id,
    }

    serializer = PhotoSerializer(data=payload)

    assert not serializer.is_valid()
    assert "non_field_errors" in serializer.errors or "name" in serializer.errors
