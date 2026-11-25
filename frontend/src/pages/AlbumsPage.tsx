import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import type { Album } from '../interfaces/interfaces';
import { AlbumCard } from '../components/AlbumCard';
import { ApiUrls } from '../utils/ApiUrls';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import { useAuth } from '../context/AuthContext';


export const AlbumPage: React.FC = () => {
    const { event_name } = useParams<{ event_name: string }>();
    const [albums, setAlbums] = useState<Album[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const navigate = useNavigate();

    const { isAuthenticated, user } = useAuth();

    const fetchAlbums = useCallback(async () => {
        const url = event_name ? `${ApiUrls.getAlbums}?event=${event_name}` : ApiUrls.getAlbums;
        try {
            const data = await api.apiGet<Album[]>(url);
            setAlbums(data);
        } catch (err) {
            setAlbums([]);
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('An unknown error occurred');
            }
        } finally {
            setLoading(false);
        }
    }, [event_name]);

    useEffect(() => {
        fetchAlbums();
    }, [fetchAlbums]);

    const handleAddClick = () => {
        navigate('/albums/create/' + event_name);
    };

    if (loading) return <p>Loading items...</p>
    { error && <Alert severity="error">{error}</Alert> }
    return (
        <div className="flex-1 flex flex-col">
            <div className="flex flex-col items-center justify-center flex-1 bg-gray-100 px-4 py-6">
                <h4 className="mb-4 font-serif text-3xl sm:text-4xl font-bold text-center bg-transparent">{event_name?.toUpperCase()}</h4>
                {isAuthenticated && user?.role === 'admin' ?
                    <Button variant="contained" className="mx-auto mb-4" onClick={handleAddClick}>Add Album</Button>
                    : null
                }
                {albums.length > 0 ?
                    <Row xs={1} sm={2} lg={3} xl={4} className="g-4 justify-content-center w-100">
                        {albums.map((album) => (
                            <Col key={album.id} className="flex justify-center">
                                <AlbumCard key={album.id} album={album} showLinks={false} />
                            </Col>
                        ))}
                    </Row> :
                    <Alert severity="info">
                        <p>No albums found</p>
                    </Alert>}
            </div>
        </div>
    )
}

export default AlbumPage;