import pytest
from django.urls import resolve, reverse

def test_user_list_url_resolves():
    url = reverse("user-list")
    resolved = resolve(url)

    assert resolved.func.cls.__name__ == "UserViewSet"