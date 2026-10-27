from django.urls import path, include
from .views import PhotoViewSet, ToggleFavoriteView, UserFavoritePhotosView
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'photos', PhotoViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('photos/<int:pk>/favorite', ToggleFavoriteView.as_view(), name='photo-toggle-favorite'),
    path('photos/favorites', UserFavoritePhotosView.as_view(), name='photo-favorites'),
]