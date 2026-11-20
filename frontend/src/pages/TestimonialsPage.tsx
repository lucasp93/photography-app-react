import React from 'react';
import Carousel from 'react-bootstrap/Carousel';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import StarIcon from '@mui/icons-material/Star';
import PhotoCameraBackIcon from '@mui/icons-material/PhotoCameraBack';

export const TestimonialsPage: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-start md:justify-center flex-1 bg-gray-200 px-3 sm:px-4 py-4 sm:py-6">
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-wide uppercase mb-2">
                Testimonials
            </h3>
            <div className="w-full max-w-4xl min-w-0 px-0 sm:px-4 py-3 sm:py-6 mx-auto">
                <Carousel fade>
                    <Carousel.Item>
                        <img
                            className="w-full h-80 sm:h-96 md:h-[420px] object-cover rounded-lg brightness-50"
                            src="https://picsum.photos/id/211/2560/1440.jpg"
                            alt="First slide"
                        />
                        <Carousel.Caption className="px-2 sm:px-6 pb-4 sm:pb-6">
                            <h3 className="text-base sm:text-xl md:text-2xl font-semibold mb-1 sm:mb-2">
                                Capturing moments we didn't even know were happening
                            </h3>
                            <p className="text-xs sm:text-sm md:text-base mb-1 sm:mb-2">
                                Looking through our wedding gallery brought back every single emotion from the day. She didn't just capture the big moments, but all the candid interactions with our family that we missed in the rush of the day.
                            </p>
                            <span className="text-xs sm:text-sm opacity-90">Sarah & David - Napa Valley Wedding</span>
                        </Carousel.Caption>
                    </Carousel.Item>
                    <Carousel.Item>
                        <img
                            className="w-full h-80 sm:h-96 md:h-[420px] object-cover rounded-lg brightness-50"
                            src="https://picsum.photos/id/116/2560/1440.jpg"
                            alt="Second slide"
                        />
                        <Carousel.Caption className="px-2 sm:px-6 pb-4 sm:pb-6">
                            <h3 className="text-base sm:text-xl md:text-2xl font-semibold mb-1 sm:mb-2">
                                A miracle worker with energetic toddlers!
                            </h3>
                            <p className="text-xs sm:text-sm md:text-base mb-1 sm:mb-2">
                                Our three-year-old was having a full meltdown 20 minutes before our shoot. Somehow, she turned the whole hour into a game, stayed incredibly patient, and delivered the sweetest family photos we’ve ever had.
                            </p>
                            <span className="text-xs sm:text-sm opacity-90">The Miller Family - Golden Hour Portrait Session</span>
                        </Carousel.Caption>
                    </Carousel.Item>
                    <Carousel.Item>
                        <img
                            className="w-full h-80 sm:h-96 md:h-[420px] object-cover rounded-lg brightness-50"
                            src="https://picsum.photos/id/111/2560/1440.jpg"
                            alt="Third slide"
                        />
                        <Carousel.Caption className="px-2 sm:px-6 pb-4 sm:pb-6">
                            <h3 className="text-base sm:text-xl md:text-2xl font-semibold mb-1 sm:mb-2">
                                Seamless production and exceptional brand delivery
                            </h3>
                            <p className="text-xs sm:text-sm md:text-base mb-1 sm:mb-2">
                                We hired her for our quarterly product launch shoot. Shot list execution was flawless, tethered previews kept our creative director aligned on set, and the post-production edits were delivered days ahead of schedule.
                            </p>
                            <span className="text-xs sm:text-sm opacity-90">Alex Rivera - Head of Brand, Studio Simply Co.</span>
                        </Carousel.Caption>
                    </Carousel.Item>
                </Carousel>
            </div>
            <Grid container spacing={{ xs: 1.5, md: 2 }} className="w-full max-w-6xl mx-auto mt-2 mb-2 px-3 py-3 bg-neutral-500 text-neutral-200 border-solid rounded-md">
                <Grid size={{ xs: 12, md: 6 }} className="flex items-center justify-center">
                    <Stack direction="row" spacing={1} className="items-center justify-center flex-wrap text-center mx-auto">
                        <Typography variant="subtitle1" component="div">
                            4.8/5
                        </Typography>
                        <StarIcon className="text-amber-400" />
                        <Typography variant="subtitle2" component="div">
                            Rating across 120+ Verified Client Reviews
                        </Typography>
                    </Stack>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }} className="flex items-center justify-center">
                    <Stack direction="row" spacing={1} className="items-center justify-center flex-wrap text-center mx-auto">
                        <PhotoCameraBackIcon className="text-neutral-100" />
                        <Typography variant="subtitle2" component="div">
                            Featured in Test Weddings & Portraits
                        </Typography>
                    </Stack>
                </Grid>
            </Grid>
        </div>
    );
}