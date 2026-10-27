import pytest
from django.db import IntegrityError
from django.utils import timezone
from apps.photos.models import Photo
from apps.albums.models import Album
from apps.orders.models import Order

def test_create_photo_with_required_album(db):
    album = Album.objects.create(
        name="Wedding 2026",
        event="wedding",
        author="John Doe",
        created_at=timezone.now(),
        updated_at=timezone.now(),
    )
    photo = Photo.objects.create(
        name="Sunset at the beach",
        author="JohnD",
        url="https://picsum.photos/id/231/1200/800.jpg",
        album=album,
    )

    assert photo.name == "Sunset at the beach"
    assert photo.album == album
    assert photo.featured is False
    assert str(photo) == f"Sunset at the beach (Album: {album.name})"

def test_photo_creation_fails_without_album(db):
    with pytest.raises(IntegrityError):
        Photo.objects.create(
            name="Orphan photo",
            author="JohnD",
            url="https://picsum.photos/id/231/1200/800.jpg",
            album=None,
        )

def test_photo_can_belong_to_multiple_orders_and_survives_order_deletion(db):
    album = Album.objects.create(name="Album", event="wedding", author="Alex")
    photo = Photo.objects.create(
        name="Portrait",
        author="Alex",
        url="https://example.com/portrait.jpg",
        album=album,
    )
    first_order = Order.objects.create(
        client_name="Client One",
        client_email="one@example.com",
        client_contact="+14155552671",
        price="10.00",
    )
    second_order = Order.objects.create(
        client_name="Client Two",
        client_email="two@example.com",
        client_contact="+14155552672",
        price="10.00",
    )
    photo.orders.add(first_order, second_order)

    first_order.delete()

    assert Photo.objects.filter(pk=photo.pk).exists()
    assert list(photo.orders.all()) == [second_order]

def test_unique_photo_name_per_album_constrint(db):
    album1 = Album.objects.create(name="Album One", event="wedding", author="John")
    album2 = Album.objects.create(name="Album Two", event="family", author="Alice")

    Photo.objects.create(
        name="Header Image", 
        author="JohnD", 
        url="https://picsum.photos/id/231/1200/800.jpg", 
        album=album1,
    )

    # Same name in a different album must success
    photo_in_album2 = Photo.objects.create(
        name="Header Image", author="Alice", url="https://picsum.photos/id/231/1200/800.jpg", album=album2,
    )

    assert photo_in_album2.id is not None

    # Same name in the same album must trigger constraint violation
    with pytest.raises(IntegrityError):
        Photo.objects.create(
            name="Header Image", author="JohnD", url="https://picsum.photos/id/231/1200/800.jpg", album=album1,
        )
