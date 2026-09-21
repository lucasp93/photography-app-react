import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Album, Photo } from '../interfaces/interfaces';
import Card from 'react-bootstrap/Card';
import IconButton from '@mui/material/IconButton';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
// import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { ApiUrls } from '../utils/ApiUrls';
import api from '../services/api';

export interface AlbumCardProps {
    album: Album | null;
    showLinks?: boolean;
}

export const AlbumCard: React.FC<AlbumCardProps> = ({
    album = null,
    showLinks = true
}) => {
    const [featured, setFeatured] = useState<Photo[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const fetchFeaturedPhotos = useCallback(async () => {
        const url = album ? `${ApiUrls.getPhotos}?album_id=${album.id}&featured=true` : ApiUrls.getPhotos;
        try {
            const data = await api.apiGet<Photo[]>(url);
            setFeatured(data);
        } catch (err) {
            console.error(`Failed to fetch photos for album ${album?.id}`, err);
            setFeatured([]);
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('An unknown error occurred');
            }
        } finally {
            setLoading(false);
        }
    }, []);

    const handleAlbumClick = () => {
        navigate(`/albums/${album?.id}/`);
    };

    useEffect(() => {
        fetchFeaturedPhotos();
    }, [fetchFeaturedPhotos]);

    if (loading) return <p>Loading items...</p>
    if (error) return <p>Error: {error}</p>
    return (
        <Card border="info" style={{ width: '18rem' }} onClick={handleAlbumClick}>
            <Card.Img variant="top" src={featured[0]?.url || 'https://picsum.photos/id/237/1200/800.jpg'} />
            <Card.Body>
                <Card.Title>{album?.name}</Card.Title>
                <Card.Text>
                    {album?.author}
                </Card.Text>
            </Card.Body>
            {showLinks ?
                <Card.Body>
                    <IconButton size="medium" color="inherit" aria-label="Favourite"><FavoriteBorderIcon /></IconButton>
                    <IconButton size="medium" color="inherit" aria-label="Cart"><ShoppingBagIcon /></IconButton>
                    {/* <Card.Link href="#">Card Link</Card.Link>
                <Card.Link href="#">Another Link</Card.Link> */}
                </Card.Body>
                : null}
        </Card>
    )
}


export default AlbumCard;