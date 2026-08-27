from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework import status, viewsets
from rest_framework.filters import SearchFilter, OrderingFilter
from ..photos.models import Photo
from ..photos.serializers import PhotoSerializer


class PhotoViewSet(viewsets.ModelViewSet):
    """
    Standard CRUD actions for Photos
    """

    queryset = Photo.objects.select_related("album", "order").all()
    serializer_class = PhotoSerializer

    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ["name", "author"]
    ordering_fields = ["created_at", "name"]

    def get_queryset(self):
        queryset = super().get_queryset()
        album_id = self.request.query_params.get("album_id")
        featured = self.request.query_params.get("featured")
        if album_id:
            queryset = queryset.filter(album_id=album_id)
        if featured is not None:
            is_featured = featured.lower() in ["true", "1"]
            queryset = queryset.filter(featured=is_featured)
        return queryset
