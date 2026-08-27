from django.urls import resolve, reverse


def test_photo_list_url_resolves():
    url = reverse("photo-list")
    resolved = resolve(url)
    assert resolved.func.cls.__name__ == "PhotoViewSet"


def test_photo_detail_url_resolves():
    url = reverse("photo-detail", kwargs={"pk": 1})
    resolved = resolve(url)
    assert resolved.func.cls.__name__ == "PhotoViewSet"
