from django.shortcuts import get_object_or_404
from rest_framework import viewsets
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from ..users.models import User
from ..users.serializers import UserSerializer


class UserViewSet(viewsets.ModelViewSet):
    """
    User standard actions
    """

    queryset = User.objects.all().order_by("id")
    serializer_class = UserSerializer

    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filter_fields = ["username", "email", "role"] # Enable exact matching via URL paramsil
    search_fields = ["username", "email"] # Enable partial searching via ?search=
    ordering_fields = ["date_joined", "username"]
