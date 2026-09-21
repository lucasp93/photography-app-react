import { useParams } from 'react-router-dom';
import { useState, useCallback, useEffect } from 'react';
import { ApiUrls } from '../utils/ApiUrls';
import api from '../services/api';
import type { Photo } from '../interfaces/interfaces';

import { MainHeader } from '../components/MainHeader';
import { PhotoCarousel } from '../components/PhotoCarousel';
import { MainFooter } from '../components/MainFooter';

export const HomePage = () => {
    const { album_id } = useParams<{ album_id: string }>();
    const [photos, setPhotos] = useState<Photo[]>([]);

    {/* Fetch photos from backend */ }
    const fetchPhotos = useCallback(async () => {
        const url = album_id ? `${ApiUrls.getPhotos}?album_id=${album_id}` : ApiUrls.getPhotos;
        try {
            const data = await api.apiGet<Photo[]>(url);
            setPhotos(data);
        } catch (err) {
            console.error('Failed to fetch photos', err);
            setPhotos([]);
        }
    }, [album_id]);
    useEffect(() => {
        fetchPhotos();
    }, [fetchPhotos]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            {/* Ensure w-full is explicit, remove invalid w-4xl, and add min-w-0 to prevent flex overflow */}
            <div className="w-full max-w-7xl min-w-0 px-4 py-8 mx-auto border-solid rounded-md bg-gray-200">
                <PhotoCarousel
                    photos={photos}
                    autoPlay={true}
                    arrowNav={false}
                    interval={4000}
                />
            </div>
        </div>
    )
};
export default HomePage;