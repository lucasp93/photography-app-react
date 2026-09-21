from rest_framework import viewsets
from rest_framework.filters import OrderingFilter, SearchFilter
from ..albums.models import Album
from ..albums.serializers import AlbumSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny


class AlbumViewSet(viewsets.ModelViewSet):
    """
    Standard CRUD actions for Albums
    """

    permission_classes = [IsAuthenticated]

    queryset = Album.objects.all()
    serializer_class = AlbumSerializer

    # Enable buit-in search and ordering
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ['name', 'event', 'author']
    ordering_fields = ["created_at", "name"]

    def get_permissions(self):
        """
        Instiated and returns the list of permissions that this view required. 
        """
        if self.action in ["list", "retrieve"]:
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAuthenticated]

        return [permission() for permission in permission_classes]

    def get_queryset(self):
        queryset = Album.objects.all().order_by('id')
        event = self.request.query_params.get('event')
        album_id = self.request.query_params.get('id')
        if event:
            queryset = queryset.filter(event=event)
        if album_id:
            queryset = queryset.filter(id=album_id)
        return queryset