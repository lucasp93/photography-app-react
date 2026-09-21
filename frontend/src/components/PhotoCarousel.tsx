import React, { useState } from 'react';
import { Paper, Typography } from '@mui/material';
import type { Photo } from '../interfaces/interfaces';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export interface PhotoCarouselProps {
    photos: Photo[];
    autoPlay?: boolean;
    arrowNav?: boolean;
    pagination?: boolean;
    interval?: number;
    loopEnabled?: boolean;
    className?: string;
}

export const PhotoCarousel: React.FC<PhotoCarouselProps> = ({
    photos = [],
    autoPlay = false,
    arrowNav = true,
    pagination = true,
    interval = 4000,
    loopEnabled = true,
    className = "",
}) => {
    //const [currentIndex, setCurrentIndex] = useState(0);
    //const [isPlaying, setIsPlaying] = useState<boolean>(autoPlay);


    if (!photos || photos.length === 0) {
        return (
            <Paper className="p-8 text-center text-gray-500 rounded-2xl">
                <Typography variant="body1">No photos available</Typography>
            </Paper>
        );
    }

    return (
        <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={15}
            centeredSlides={false}
            grabCursor={true}
            navigation={arrowNav}
            keyboard={true}
            breakpoints={{
                320: { slidesPerView: 1 }, // Mobile
                640: { slidesPerView: 2 }, // Tablet
                1024: { slidesPerView: 4 }, // Desktop
            }}
            autoplay={{
                enabled: autoPlay,
                delay: interval,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
            }}
            pagination={{
                enabled: pagination,
                clickable: true,
                type: 'bullets',
            }}
            loop={loopEnabled}
            className="pb-5"
        >
            {photos.map((photo) => (
                <SwiperSlide key={photo.id}>
                    <div className="flex flex-col items-center w-full h-100">
                        <img
                            src={photo.url}
                            alt={photo.name}
                            className="w-full h-80 object-cover rounded-lg"
                        />
                        <span className="mt-2 font-bold">{photo.name}</span>
                        <p className="text-sm text-gray-500">{photo.author}</p>
                    </div>
                </SwiperSlide>
            ))}
        </Swiper>
    );
};

export default PhotoCarousel;