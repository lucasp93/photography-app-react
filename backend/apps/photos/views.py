from rest_framework.decorators import permission_classes
from django.shortcuts import get_object_or_404
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.response import Response
from rest_framework.decorators import action
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

    queryset = (
        Photo.objects.select_related("album").prefetch_related("orders").order_by("id")
    )
    serializer_class = PhotoSerializer

    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ["name", "author", "album_id", "featured"]
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


class FeaturedPhotosView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        queryset = Photo.objects.all().order_by("id")
        queryset = queryset.filter(featured=True)
        serializer = PhotoSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class UserFavoritePhotosView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        # Query photos favorited by the user
        favorited_photos = user.favorite_photos.all()
        # Serialize using model's to_dict method
        data = [photo.to_dict(request=request) for photo in favorited_photos]
        return Response(data, status=status.HTTP_200_OK)
