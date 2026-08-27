from django.urls import reverse, resolve

def test_album_list_url_resolves():
    url = reverse("album-list")
    resolved = resolve(url) # Resolve the URL to a view function

    assert resolved.func.cls.__name__ == "AlbumViewSet" # Check that the view function is from the AlbumViewSet class

def test_album_detail_url_resolves():
    url = reverse("album-detail", kwargs={"pk": 1})
    resolved = resolve(url)

    assert resolved.func.cls.__name__ == "AlbumViewSet" # Check that the view function is from the AlbumViewSet class