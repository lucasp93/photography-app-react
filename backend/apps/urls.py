from django.urls import path, include
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)

urlpatterns = [
    # JWT Auth Endpoints
    # Endpoint to get the access and refresh token (login)
    path("token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    # Endpoint to get a new access token using a refresh token
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("token/verify/", TokenVerifyView.as_view(), name="token_verify"),

    # App Endpoints
    path("users/", include("apps.users.urls")),
]