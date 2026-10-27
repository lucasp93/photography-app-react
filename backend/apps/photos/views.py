from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework import status, viewsets
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView
from ..photos.models import Photo
from ..photos.serializers import PhotoSerializer



class PhotoViewSet(viewsets.ModelViewSet):
    """
    Standard CRUD actions for Photos
    """

    permission_classes = [IsAuthenticated]

    queryset = Photo.objects.select_related("album").prefetch_related("orders")
    serializer_class = PhotoSerializer

    filter_backends = [SearchFilter, OrderingFilter]
    filterset_fields = ["name", "author"]
    search_fields = ["name", "author"]
    ordering_fields = ["created_at", "name"]

    def get_permissions(self):
        """
        Instiated and returns the list of permissions that this view requires.
        """
        # Actions list and retrieve are public
        if self.action in ["list", "retrieve"]:
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAuthenticated]

        return [permission() for permission in permission_classes]

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

class ToggleFavoriteView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        photo = get_object_or_404(Photo, pk=pk)
        user = request.user

        if photo.favorited_by.filter(pk=user.pk).exists():
            photo.favorited_by.remove(user)
            favorited = False
        else:
            photo.favorited_by.add(user)
            favorited = True

        return Response(
            {"id": photo.id, "is_favorited": favorited},
            status=status.HTTP_200_OK,
        )

class UserFavoritePhotosView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        # Query photos favorited by the user
        favorited_photos = user.favorite_photos.all()
        # Serialize using model's to_dict method
        data = [photo.to_dict(request=request) for photo in favorited_photos]
        return Response(data, status=status.HTTP_200_OK)