import React from 'react';
import type { Photo } from '../interfaces/interfaces';
import Card from 'react-bootstrap/Card';
import IconButton from '@mui/material/IconButton';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
// import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

export interface PhotoCardProps {
  photo: Photo | null;
  showLinks?: boolean;
}

export const PhotoCard: React.FC<PhotoCardProps> = ({
  photo = null,
  showLinks = true
}) => {
  return (
    <Card border="info" style={{ width: '18rem' }}>
      <Card.Img variant="top" src={photo?.url} />
      <Card.Body>
        <Card.Title>{photo?.name}</Card.Title>
        <Card.Text>
          {photo?.author}
        </Card.Text>
      </Card.Body>
      {showLinks ?
        <Card.Body>
          <IconButton size="medium" color="inherit" aria-label="Favourite"><FavoriteBorderIcon /></IconButton>
          <IconButton size="medium" color="inherit" aria-label="Cart"><ShoppingBagIcon /></IconButton>
          {/* <Card.Link href="#">Card Link</Card.Link>
        <Card.Link href="#">Another Link</Card.Link> */}
        </Card.Body> : null
      }
    </Card>
  )
}


export default PhotoCard;