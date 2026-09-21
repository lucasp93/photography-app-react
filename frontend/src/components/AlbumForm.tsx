import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import api from '../services/api';
import { ApiUrls } from '../utils/ApiUrls';

export const AlbumForm: React.FC<{ action: string }> = ({ action }) => {
    const navigate = useNavigate();
    const { event: urlEvent } = useParams<{ event?: string }>();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const payload = {
            name: String(formData.get('name') ?? ''),
            event: String(formData.get('event') ?? ''),
            author: String(formData.get('author') ?? ''),
        };

        const url = action === 'create' ? ApiUrls.createAlbum : ApiUrls.updateAlbum;

        try {
            const response = await api.apiPost(url, payload);
            const eventValue = payload.event;
            navigate(`/portfolio/${eventValue}`);
        } catch (error) {
            console.error('Error creating album:', error);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-100">
            <Form className="w-full max-w-3xl bg-gray-200 border-solid rounded-md p-8 shadow-md" onSubmit={handleSubmit}>
                <p className="text-neutral-600 text-2xl font-bold mb-2">Create {urlEvent} album</p>
                <Form.Group className="mb-3" controlId="formBasicName">
                    <Form.Label>Name</Form.Label>
                    <Form.Control type="text" placeholder="Enter name" name="name" required />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicEvent">
                    <Form.Label>Event</Form.Label>
                    <Form.Select
                        name="event"
                        defaultValue={urlEvent ?? ''}
                        required
                    >
                        <option value="">Select Event</option>
                        <option value="weddings">Weddings</option>
                        <option value="birthday">Birthday</option>
                        <option value="family">Family</option>
                        <option value="business">Business</option>
                        <option value="maternity">Maternity</option>
                        <option value="newborn">Newborn</option>
                    </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicAuthor">
                    <Form.Label>Author</Form.Label>
                    <Form.Control type="text" name="author" placeholder="Enter author" required />
                </Form.Group>
                <Button variant="primary" type="submit">
                    Submit
                </Button>
            </Form>
        </div>
    );
};