from django.urls import path, include
from .views import PhotoViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'photos', PhotoViewSet)

urlpatterns = [
    path('', include(router.urls)),
]