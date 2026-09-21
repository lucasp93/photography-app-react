import { useState, useEffect } from 'react';
import { ApiUrls } from '../utils/ApiUrls';

export interface Album {
    id?: string | number;
    name: string | null;
    event: string | null;
    author: string | null;
    createdAt: string | null;
}

export const useAlbums = () => {
    const [albums, setAlbums] = useState<Album[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const url = ApiUrls.getAlbums;
        fetch(url)
            .then((res)=> res.json())
            .then((data) => {
                setAlbums(data)
                setLoading(false);
            });
    }, []);

    return { albums, loading};
}

export default useAlbums;