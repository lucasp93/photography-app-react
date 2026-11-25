import React, { useCallback, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import api from '../services/api';
import { ApiUrls } from '../utils/ApiUrls';
import type { Album } from '../interfaces/interfaces';
import Button from 'react-bootstrap/Button';
import type { PhotoFormPayload } from '../interfaces/interfaces';

export interface PhotoFormProps {
    action: string;
    fetchAlbum?: (albumId?: string) => Promise<Album>;
    onSubmitPhoto?: (action: string, payload: PhotoFormPayload) => Promise<unknown>;
}

const defaultFetchAlbum = (albumId?: string): Promise<Album> => {
    const url = albumId ? ApiUrls.getAlbum.replace(':id', albumId) : ApiUrls.getAlbum;
    return api.apiGet<Album>(url);
};

const defaultSubmitPhoto = (action: string, payload: PhotoFormPayload): Promise<unknown> => {
    const url = action === 'create' ? ApiUrls.createPhoto : ApiUrls.updatePhoto;
    return action === 'create' ? api.apiPost(url, payload) : api.apiPut(url, payload);
};

export const PhotoForm: React.FC<PhotoFormProps> = ({
    action,
    fetchAlbum = defaultFetchAlbum,
    onSubmitPhoto = defaultSubmitPhoto,
}) => {
    const navigate = useNavigate();
    const { album_id: urlEvent } = useParams<{ album_id?: string }>();
    const [error, setError] = useState<string | null>(null);
    const [albumTarget, setAlbumTarget] = useState<Album | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        const payload: PhotoFormPayload = {
            name: String(formData.get('name') ?? ''),
            url: String(formData.get('url') ?? ''),
            author: String(formData.get('author') ?? ''),
            album: urlEvent,
            featured: Boolean(formData.get('featured') ?? false),
        };

        try {
            await onSubmitPhoto(action, payload);
            navigate(`/albums/${urlEvent}`);
        } catch (err) {
            console.error('Error creating album:', err);
            setError(`Photo creation failed: ${err}`);
        }

    };

    const fetchAlbumData = useCallback(async () => {
        try {
            const data = await fetchAlbum(urlEvent);
            setAlbumTarget(data);
        } catch (err) {
            setError(`Failed to fetch album with ID: ${urlEvent}`);
        }
    }, [urlEvent, fetchAlbum]);

    useEffect(() => {
        fetchAlbumData();
    }, [fetchAlbumData]);

    return (
        <div className="flex flex-col items-center justify-center flex-1 bg-neutral-100 px-4 py-6">
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
                    <Form.Control type="text" placeholder="Enter name" name="name" required />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicEvent">
                    <Form.Control type="text" placeholder="Enter author" name="author" required />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicEvent">
                    <Form.Control type="text" placeholder="Enter url" name="url" required />
                </Form.Group>
                <Form.Group className="mb-3 flex flex-row justify-start" controlId="formBasicEvent">
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