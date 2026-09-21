import { useState, useEffect } from 'react';
import { ApiUrls } from '../utils/ApiUrls';

export interface Album {
    id?: string | number;
    name: string | null;
    event: string | null;
    author: string | null;
    createdAt: string | null;
}

export interface Order {
    id?: string | number;
    orderNumber: string | null;
    clientName: string | null;
    clientEmail: string | null;
    clientContact: string | null;
    price: number | null;
    createdAt: string | null;
}

export interface Photo {
    id: string | number;
    name: string;
    author: string;
    featured: boolean;
    url: string;
    createdAt: string;
    order: Order | null;
    album: Album | null;
}

export const getPhotos = () => {
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const url = ApiUrls.getPhotos;
        fetch(url)
            .then((res)=> res.json())
            .then((data) => {
                setPhotos(data)
                setLoading(false);
            });
    }, []);

    return { photos, loading};
}

export const getPhoto = (id: string | number) => {
    const [photo, setPhoto] = useState<Photo | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const url = ApiUrls.getPhoto.replace(':id', id.toString());
        fetch(url)
            .then((res) => res.json())
            .then((data) => {
                setPhoto(data);
                setLoading(false);
            });
    }, []);

    return { photo, loading };
}