import pytest
from apps.albums.models import Album
from django.db import IntegrityError
from django.utils import timezone


# Fixtures (reusable test setup data)
@pytest.fixture
def album(db):
    """Creates and returns a sample Album instance."""
    return Album.objects.create(
        name="Test Album", 
        event="wedding", 
        author="test_author", 
        created_at=timezone.now(), 
        updated_at=timezone.now())

# ------------------------------------------------------------------
# Album Model Tests
# ------------------------------------------------------------------
@pytest.mark.django_db
class TestAlbumModel:
    def test_create_album_with_valid_data(self, album):
        """Test that an album is successfully create with correct attributes."""
        assert Album.objects.count() == 1
        assert album.name == "Test Album"
        assert album.event == "wedding"
        assert album.author == "test_author"
        assert album.created_at is not None
        assert album.updated_at is not None

    def test_unique_name_constraint(self, album):
        """Test that creating a second album with an existing name raises IntegrityError."""
        with pytest.raises(IntegrityError):
            Album.objects.create(
                name="Test Album",
                event="wedding",
                author="test_author",
                created_at=timezone.now(),
                updated_at=timezone.now(),
            )

    def test_auto_now_and_auto_now_add(self, album):
        """Test that created_at stays fixed while updated_at refreshes on save."""
        initial_created_at = album.created_at
        initial_updated_at = album.updated_at

        # Update a field and save
        album.name = "Updated test album"
        album.save()

        album.refresh_from_db()
        assert album.created_at == initial_created_at
        assert album.updated_at > initial_updated_at