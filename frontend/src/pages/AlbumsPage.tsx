import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import type { Album } from '../interfaces/interfaces';
import { AlbumCard } from '../components/AlbumCard';
import { ApiUrls } from '../utils/ApiUrls';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Alert from 'react-bootstrap/Alert';
import Button from '@mui/material/Button';


export const AlbumPage: React.FC = () => {
    const { event_name } = useParams<{ event_name: string }>();
    const [albums, setAlbums] = useState<Album[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const navigate = useNavigate();

    const fetchAlbums = useCallback(async () => {
        const url = event_name ? `${ApiUrls.getAlbums}?event=${event_name}` : ApiUrls.getAlbums;
        try {
            const data = await api.apiGet<Album[]>(url);
            setAlbums(data);
        } catch (err) {
            console.error(`Failed to fetch albums for event ${event_name}`, err);
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
    if (error) return <p>Error: {error}</p>
    return (
        <div>
            {/* <h4 className="mt-2 font-serif text-4l font-cursice text-center bg-transparent">{event_name?.toUpperCase()}</h4> */}
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
                {/* <CardGroup className="flex flex-wrap justify-center gap-4"> */}
                <Button variant="contained" className="block float-right mb-2" onClick={handleAddClick}>Add Album</Button>
                <h4 className="mb-4 font-serif text-4l font-bold text-center bg-transparent">{event_name?.toUpperCase()}</h4>
                {albums.length > 0 ?
                    <Row xs={1} md={4} className="g-4 justify-center">
                        {albums.map((album) => (
                            <Col key={album.id} className="flex justify-center">
                                <AlbumCard key={album.id} album={album} showLinks={true} />
                            </Col>
                        ))}
                    </Row> :
                    <Alert variant="light">
                        <p>No albums found</p>
                    </Alert>}
            </div>
        </div>
    )
}

export default AlbumPage;