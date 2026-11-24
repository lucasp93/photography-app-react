import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Album, Photo } from '../interfaces/interfaces';
import Card from 'react-bootstrap/Card';
import IconButton from '@mui/material/IconButton';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { ApiUrls } from '../utils/ApiUrls';
import api from '../services/api';
import Alert from '@mui/material/Alert';

export interface AlbumCardProps {
    album: Album | null;
    showLinks?: boolean;
    fetchFeaturedPhotos?: (albumId?: string | number) => Promise<Photo[]>;
}

const defaultFetchFeaturedPhotos = (albumId?: string | number): Promise<Photo[]> => {
    const url = albumId ? `${ApiUrls.getPhotos}?album_id=${albumId}&featured=true` : ApiUrls.getPhotos;
    return api.apiGet<Photo[]>(url);
};

export const AlbumCard: React.FC<AlbumCardProps> = ({
    album = null,
    showLinks = true,
    fetchFeaturedPhotos: fetchPhotosFn = defaultFetchFeaturedPhotos,
}) => {
    const [featured, setFeatured] = useState<Photo[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const fetchFeaturedPhotos = useCallback(async () => {
        try {
            const data = await fetchPhotosFn(album?.id);
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
    }, [album?.id, fetchPhotosFn]);

    const handleAlbumClick = () => {
        navigate(`/albums/${album?.id}/`);
    };

    useEffect(() => {
        fetchFeaturedPhotos();
    }, [fetchFeaturedPhotos]);

    if (loading) return <p>Loading items...</p>
    { error && <Alert severity="error">{error}</Alert> }
    return (
        <Card border="secondary" bg="light" className="w-full max-w-72 hover:shadow-lg transition-shadow cursor-pointer" onClick={handleAlbumClick}>
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
                </Card.Body>
                : null}
        </Card>
    )
}


export default AlbumCard;