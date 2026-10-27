import React from 'react';
import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Photo, Album } from '../interfaces/interfaces';
import { ApiUrls } from '../utils/ApiUrls';
import { PhotoCard } from '../components/PhotoCard';
import api from '../services/api';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Alert from 'react-bootstrap/Alert';
import Button from '@mui/material/Button';
import { useAuth } from '../context/AuthContext';
import { getUserFavoritePhotos } from '../services/utils';

export const AlbumPhotosPage: React.FC = () => {
    const { album_id } = useParams<{ album_id: string }>();
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [album, setAlbum] = useState<Album | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [favoritePhotos, setFavoritePhotos] = useState<number[]>([]); // Store favorite photo IDs

    const { isAuthenticated, user } = useAuth();

    const navigate = useNavigate();
    const fetchAlbum = useCallback(async () => {
        const url = album_id ? ApiUrls.getAlbum.replace(':id', album_id) : ApiUrls.getAlbum;
        try {
            const data = await api.apiGet<Album>(url);
            setAlbum(data);
        } catch (err) {
            console.error(`Failed to fetch album ${album_id}`, err);
            setAlbum(null);
        }
    }, [album_id]);

    const fetchPhotos = useCallback(async () => {
        const url = album_id ? `${ApiUrls.getPhotos}?album_id=${album_id}` : ApiUrls.getPhotos;
        try {
            const data = await api.apiGet<Photo[]>(url);
            setPhotos(data);
        } catch (err) {
            console.error(`Failed to fetch photos for album ${album_id}`, err);
            setPhotos([]);
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('An unknown error occurred');
            }
        } finally {
            setLoading(false);
        }
    }, [album_id]);

    const handleAddClick = () => {
        navigate('/photos/create/' + album_id);
    }

    const fetchFavoritePhotos = useCallback(async () => {
        const favorite_photos = await getUserFavoritePhotos(Number(user?.id));
        if (favorite_photos && favorite_photos?.length > 0) {
            const favoritePhotoIds = favorite_photos.map(photo => Number(photo.id)); // Map photo IDs
            setFavoritePhotos(favoritePhotoIds); // Set favorite photo IDs
        } else {
            setFavoritePhotos([]);
        }
    }, []);

    const handleFavoriteChange = (photoId: number, newStatus: boolean) => {
        const numericId = Number(photoId);
        setFavoritePhotos((prevFavorites) => {
            if (newStatus) {
                // Add favorite IDs if not already included
                if (prevFavorites.includes(numericId)) return prevFavorites;
                return [...prevFavorites, numericId];
            } else {
                // Remove from favorite IDs if unfavorited
                return prevFavorites.filter((id) => Number(id) !== numericId);
            }
        });
    };

    useEffect(() => {
        fetchPhotos();
        fetchAlbum();
        fetchFavoritePhotos();
    }, [fetchPhotos, fetchAlbum, fetchFavoritePhotos]);

    if (loading) return <p>Loading photos...</p>
    if (error) return <p>Error: {error}</p>
    return (
        <div>
            {/* <h4 className="mt-2 font-serif text-4l font-cursice text-center bg-transparent">{event_name?.toUpperCase()}</h4> */}
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 pt-5 pb-5">
                {/* <CardGroup className="flex flex-wrap justify-center gap-4"> */}
                {isAuthenticated && user?.role === 'admin' ?
                    <Button variant="contained" className="block float-right mb-2 mt-2" onClick={handleAddClick}>Add Photo</Button>
                    : null
                }
                <h4 className={`mb-4 font-serif text-4l font-bold text-center bg-transparent ${isAuthenticated && user?.role === 'admin' ? 'mt-2' : ''}`}>{album?.name?.toUpperCase()}</h4>
                {photos.length > 0 ?
                    <Row xs={1} md={4} className="g-4 justify-center">
                        {photos.map((photo) => (
                            <Col key={photo.id} className="flex justify-center">
                                <PhotoCard
                                    //key={photo.id}
                                    photo={photo}
                                    isFavorited={Boolean(favoritePhotos.includes(Number(photo.id)))}
                                    showLinks={true}
                                    onFavoriteChange={handleFavoriteChange} />
                            </Col>
                        ))}
                    </Row> :
                    <Alert variant="light">
                        <p>No photos found</p>
                    </Alert>}
            </div>
        </div>
    )
};