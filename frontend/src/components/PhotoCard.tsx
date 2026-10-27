import React, { useState, useEffect } from 'react';
import type { Photo } from '../interfaces/interfaces';
import Card from 'react-bootstrap/Card';
import IconButton from '@mui/material/IconButton';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
// import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import api from '../services/api';

export interface PhotoCardProps {
  photo: Photo | null;
  isFavorited?: boolean;
  showAlbum?: boolean;
  showLinks?: boolean;
  onFavoriteChange?: (photoId: number, newStatus: boolean) => void;
}


export const PhotoCard: React.FC<PhotoCardProps> = ({
  photo = null,
  isFavorited = false,
  showAlbum = false,
  showLinks = true,
  onFavoriteChange
}) => {
  const [favorited, setFavorited] = useState<boolean>(isFavorited);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleFavoriteToggle = async () => {
    if (isLoading || !photo) return;
    setIsLoading(true);
    // Optimistic UI update for instant feedback
    const previousSatate = favorited;
    const newOptimisticState = !previousSatate;
    setFavorited(!newOptimisticState);
    try {
      const data = await api.apiPost(`/api/photos/${photo?.id}/favorite`, {});
      const actualServerStatus = data.is_favorited;
      setFavorited(actualServerStatus);

      // Notify parent component of change
      if (onFavoriteChange) {
        onFavoriteChange(Number(photo.id), actualServerStatus);
      }
    } catch (err) {
      console.error('Failed to toggle favorite: ', err);
      // Revert to previous state on error
      setFavorited(previousSatate);
      if (onFavoriteChange) {
        onFavoriteChange(Number(photo.id), previousSatate);
      }
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    setFavorited(isFavorited);
  }, [isFavorited]);

  return (
    <Card border="info" style={{ width: '18rem' }}>
      <Card.Img variant="top" src={photo?.url} />
      <Card.Body>
        <Card.Title>{photo?.name}</Card.Title>
        <Card.Text>
          {photo?.author}
        </Card.Text>
        {showAlbum ?
          <Card.Text>
            {photo?.album_name}
          </Card.Text>
          : null
        }
      </Card.Body>
      {showLinks ?
        <Card.Body>
          <IconButton size="medium" color="inherit" aria-label="Favourite" onClick={handleFavoriteToggle}>
            {favorited ?
              <FavoriteIcon />
              :
              <FavoriteBorderIcon />
            }
          </IconButton>
          <IconButton size="medium" color="inherit" aria-label="Cart"><ShoppingBagIcon /></IconButton>
          {/* <Card.Link href="#">Card Link</Card.Link>
        <Card.Link href="#">Another Link</Card.Link> */}
        </Card.Body> : null
      }
    </Card>
  )
}


export default PhotoCard;