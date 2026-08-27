import pytest
from django.urls import reverse
from rest_framework import status
from apps.photos.models import Photo
from apps.albums.models import Album


def test_list_photos(jwt_auth_client, db):
    album = Album.objects.create(
        name="Travel 2026",
        event="bussiness",
        author="Mark",
    )

    Photo.objects.create(
        name="Mountain",
        author="Mark",
        url="https://picsum.photos/id/235/1200/800.jpg",
        album=album,
    )

    Photo.objects.create(
        name="Beach", 
        author="Mark", 
        url="https://ex.com/2.jpg", 
        album=album,
    )

    url = reverse("photo-list")
    response = jwt_auth_client.get(url)

    assert response.status_code == status.HTTP_200_OK
    assert len(response.data) == 2

def test_create_photo_with_album(jwt_auth_client):
    album = Album.objects.create(
        name="Studio Shoot",
        event="business",
        author="Photographer",
    )
    url = reverse("photo-list")
    payload = {
        "name": "Studio shot 1",
        "author": "Photographer",
        "featured": True,
        "url": "https://picsum.photos/id/231/1200/800.jpg",
        "album": album.id
    }

    response = jwt_auth_client.post(url, payload, format="json")

    assert response.status_code == status.HTTP_201_CREATED
    assert Photo.objects.filter(name="Studio shot 1").exists()

def test_create_photo_fails_without_album(jwt_auth_client):
    url = reverse("photo-list")
    payload = {
        "name": "No album shot",
        "author": "Photographer",
        "url": "https://picsum.photos/id/231/1200/800.jpg",
    }

    response = jwt_auth_client.post(url, payload, format="json")

    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert "album" in response.data

