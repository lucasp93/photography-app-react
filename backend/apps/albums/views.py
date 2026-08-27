from rest_framework import viewsets
from rest_framework.filters import OrderingFilter, SearchFilter
from ..albums.models import Album
from ..albums.serializers import AlbumSerializer

class AlbumViewSet(viewsets.ModelViewSet):
    """
    Album standard actions
    """

    queryset = Album.objects.all()
    serializer_class = AlbumSerializer

    # Enable buit-in search and ordering
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ['name', 'event', 'author']
    ordering_fields = ["created_at", "name"]

    def get_queryset(self):
        queryset = Album.objects.all().order_by('id')
        event = self.request.query_params.get('event')
        if event:
            queryset = queryset.filter(event=event)
        return queryset