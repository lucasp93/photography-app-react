import React from 'react';
import { useState, useEffect, useCallback } from 'react';
import type { Photo } from '../interfaces/interfaces';
import { getUserFavoritePhotos } from '../services/utils';
import { useAuth } from '../context/AuthContext';
import { PhotoCard } from '../components/PhotoCard';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Alert from 'react-bootstrap/Alert';
import Button from '@mui/material/Button';


export const FavouritesPage: React.FC = () => {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [favoritePhotos, setFavoritePhotos] = useState<Photo[]>([]);
    const { user } = useAuth();

    const fetchFavoritePhotos = useCallback(async () => {
        let favorite_photos: Photo[] | null = [];
        try {
            favorite_photos = await getUserFavoritePhotos(Number(user?.id));
        } catch (err: any) {
            setError(err.message || 'Failed to fetch favorite photos');
            setStatus('error');
        } finally {
            setLoading(false);
        }
        if (favorite_photos && favorite_photos?.length > 0) {
            setFavoritePhotos(favorite_photos);
        }
    }, []);

    useEffect(() => {
        fetchFavoritePhotos();
    }, [fetchFavoritePhotos]);

    // Callback passed to PhotoCard component to remove unfavorite items instantly
    const handleFavoriteChange= (photoId: number, newStatus: boolean) => {
        if (!newStatus) {
            // If user unfavorited the photo, filter it out of the list
            setFavoritePhotos((prevPhotos) => prevPhotos.filter((p) => p.id !== photoId));
        }
    }

    if (loading) return <p className="p-4">Loading items...</p>;
    if (error) return <p className="p-4 text-danger">Error: {error}</p>;

    return (
        <div>
            {/* <h4 className="mt-2 font-serif text-4l font-cursice text-center bg-transparent">{event_name?.toUpperCase()}</h4> */}
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 pt-5 pb-5">
                {/* <CardGroup className="flex flex-wrap justify-center gap-4"> */}
                {/* <h4 className={`mb-4 font-serif text-4l font-bold text-center bg-transparent ${isAuthenticated && user?.role === 'admin' ? 'mt-2' : ''}`}>{photo.album?.name?.toUpperCase()}</h4> */}
                {favoritePhotos && favoritePhotos.length > 0 ?
                    <Row xs={1} md={4} className="g-4 justify-center">
                        {favoritePhotos.map((photo) => (
                            <Col key={photo.id} className="flex justify-center">
                                <PhotoCard 
                                    key={photo.id} 
                                    photo={photo} 
                                    isFavorited={photo.is_favorited ? true : false} 
                                    showAlbum={true} 
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
        // <div className="container">
        //     <h4 className="mt-2 font-serif text-4l font-cursice text-center bg-transparent">Favourites</h4>
        //     {favoritePhotos ?
        //         favoritePhotos.map((photo) => (
        //             <div key={photo.id}>
        //                 <img src={photo.url} alt={photo.name} />
        //             </div>
        //         ))
        //         :
        //         <div>
        //             <h4 className="mt-2 font-serif text-4l font-cursice text-center bg-transparent">No photos found.</h4>
        //         </div>
        //     }
        // </div >
    )
}

export default FavouritesPage;