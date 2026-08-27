from django.urls import reverse
from rest_framework import status
from conftest import api_client
from apps.albums.models import Album

def test_list_albums(jwt_auth_client):
    Album.objects.create(
        name="Album 1",
        event="wedding",
        author="Author 1"
    )

    Album.objects.create(
        name="Album 2",
        event="family",
        author="Author 2"
    )

    url = reverse("album-list")
    response = jwt_auth_client.get(url)

    assert response.status_code == status.HTTP_200_OK
    assert len(response.data) == 2

def test_create_album(jwt_auth_client):
    url = reverse("album-list")
    payload = {
        "name": "Newborn Memories",
        "event": "newborn",
        "author": "Photographer Mark"
    }
    response = jwt_auth_client.post(url, payload, format="json")

    assert response.status_code == status.HTTP_201_CREATED
    assert Album.objects.filter(name="Newborn Memories").exists()

def test_filter_or_search_albums(jwt_auth_client):
    Album.objects.create(
        name="Summer Family",
        event="family",
        author="Photographer Tom"
    )

    Album.objects.create(
        name="Winter business",
        event="business",
        author="Photographer Carl"
    )

    url = reverse("album-list")
    response = jwt_auth_client.get(f"{url}?search=Summer")

    assert response.status_code == status.HTTP_200_OK
    assert len(response.data) == 1
    assert response.data[0]["name"] == "Summer Family"