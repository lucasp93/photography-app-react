from django.urls import reverse, resolve

def test_order_list_url_resolves():
    url = reverse("order-list")
    resolved = resolve(url) # Resolve the URL to a view function

    assert resolved.func.cls.__name__ == "OrderViewSet" # Check that the view function is from the OrderViewSet class

def test_order_detail_url_resolves():
    url = reverse("order-detail", kwargs={"pk": 1})
    resolved = resolve(url)

    assert resolved.func.cls.__name__ == "OrderViewSet" # Check that the view function is from the OrderViewSet class