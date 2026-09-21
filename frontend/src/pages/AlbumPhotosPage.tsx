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

export const AlbumPhotosPage: React.FC = () => {
    const { album_id } = useParams<{ album_id: string }>();
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [album, setAlbum] = useState<Album | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
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

    useEffect(() => {
        fetchPhotos();
        fetchAlbum();
    }, [fetchPhotos, fetchAlbum]);

    if (loading) return <p>Loading photos...</p>
    if (error) return <p>Error: {error}</p>
    return (
        <div>
            {/* <h4 className="mt-2 font-serif text-4l font-cursice text-center bg-transparent">{event_name?.toUpperCase()}</h4> */}
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
                {/* <CardGroup className="flex flex-wrap justify-center gap-4"> */}
                <Button variant="contained" className="block float-right mb-2 mt-2" onClick={handleAddClick}>Add Photo</Button>
                <h4 className="mb-4 font-serif text-4l font-bold text-center bg-transparent">{album?.name?.toUpperCase()}</h4>
                {photos.length > 0 ?
                    <Row xs={1} md={4} className="g-4 justify-center">
                        {photos.map((photo) => (
                            <Col key={photo.id} className="flex justify-center">
                                <PhotoCard key={photo.id} photo={photo} showLinks={true} />
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