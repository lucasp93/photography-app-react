from django.urls import path, include
from .views import UserViewSet, RequestPasswordResetView, ConfirmPasswordResetView
from rest_framework.routers import DefaultRouter 

router = DefaultRouter()
router.register(r'users', UserViewSet, basename="user")

urlpatterns = [
    path('password/reset/', RequestPasswordResetView.as_view(), name='password-reset-request'),
    path('password/reset/confirm/', ConfirmPasswordResetView.as_view(), name='password-reset-confirm'),
    path('', include(router.urls)),
]