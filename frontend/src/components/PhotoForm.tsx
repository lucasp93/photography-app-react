import React, { useCallback, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import api from '../services/api';
import { ApiUrls } from '../utils/ApiUrls';
import type { Album } from '../interfaces/interfaces';
import Button from 'react-bootstrap/Button';

export const PhotoForm: React.FC<{ action: string }> = ({ action }) => {
    const navigate = useNavigate();
    const { album_id: urlEvent } = useParams<{ album_id?: string }>();
    const [error, setError] = useState<string | null>(null);
    const [albumTarget, setAlbumTarget] = useState<Album | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const url = action === 'create' ? ApiUrls.createPhoto : ApiUrls.updatePhoto;

        const payload = {
            name: String(formData.get('name') ?? ''),
            url: String(formData.get('url') ?? ''),
            author: String(formData.get('author') ?? ''),
            album: urlEvent,
            featured: Boolean(formData.get('featured') ?? false),
        };

        try {
            const response = await api.apiPost(url, payload);
            navigate(`/albums/${urlEvent}`);
        } catch (err) {
            console.error('Error creating album:', err);
            setError(`Photo creation failed: ${err}`);
        }

    };

    const fetchAlbumData = useCallback(async () => {
        const url = urlEvent ? ApiUrls.getAlbum.replace(':id', urlEvent) : ApiUrls.getAlbum;
        try {
            const data = await api.apiGet<Album>(url);
            setAlbumTarget(data);
        } catch (err) {
            setError(`Failed to fetch album with ID: ${urlEvent}`);
        }
    }, [urlEvent]);

    useEffect(() => {
        fetchAlbumData();
    }, [fetchAlbumData]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-100">
            {/* <h3 className="text-neutral-600 font-bold">{album?.name}</h3> */}
            <Form className="w-full max-w-3xl bg-gray-200 border-solid rounded-md p-8 shadow-md" onSubmit={handleSubmit}>
                <p className="text-neutral-600 text-2xl font-bold mb-2">Add photo</p>
                <Form.Group className="mb-3" controlId="formBasicEvent">
                    <Form.Label>Album</Form.Label>
                    <Form.Control
                        type="text" 
                        placeholder="Enter album" 
                        name="album" 
                        disabled 
                        value={albumTarget?.name ?? ''} 
                    />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicName">
                    {/* <Form.Label>Name</Form.Label> */}
                    <Form.Control type="text" placeholder="Enter name" name="name" required />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicEvent">
                    {/* <Form.Label>Author</Form.Label> */}
                    <Form.Control type="text" placeholder="Enter author" name="author" required />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicEvent">
                    {/* <Form.Label>Url</Form.Label> */}
                    <Form.Control type="text" placeholder="Enter url" name="url" required />
                </Form.Group>
                <Form.Group className="mb-3 flex flex-row justify-left" controlId="formBasicEvent">
                    <Form.Label>Featured</Form.Label>
                    <Form.Check className="ml-2" type="checkbox" name="featured" defaultChecked={false} />
                </Form.Group>
                <Button variant="primary" type="submit">
                    Submit
                </Button>
            </Form>
        </div>
    )
}