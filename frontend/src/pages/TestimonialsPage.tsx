import React from 'react';
import Carousel from 'react-bootstrap/Carousel';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import StarIcon from '@mui/icons-material/Star';
import PhotoCameraBackIcon from '@mui/icons-material/PhotoCameraBack';

export const TestimonialsPage: React.FC = () => {
    return (
        <>
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-200">
                <div className="w-full max-w-7xl min-w-0 px-4 py-8 mx-auto">
                    <Carousel fade>
                        <Carousel.Item>
                            <img
                                className="w-full h-100 object-cover rounded-lg"
                                src="https://picsum.photos/id/120/1200/800.jpg"
                                alt="First slide"
                            />
                            <Carousel.Caption>
                                <h3>Capturing moments we didn't even know were happening</h3>
                                <p>Looking through our wedding gallery brought back every single emotion from the day. She didn't just capture the big moments, but all the candid interactions with our family that we missed in the rush of the day.</p>
                                <span>Sarah & David - Napa Valley Wedding</span>
                            </Carousel.Caption>
                        </Carousel.Item>
                        <Carousel.Item>
                            <img
                                className="w-full h-100 object-cover rounded-lg"
                                src="https://picsum.photos/id/120/1200/800.jpg"
                                alt="First slide"
                            />
                            <Carousel.Caption>
                                <h3>A miracle worker with energetic toddlers!</h3>
                                <p>Our three-year-old was having a full meltdown 20 minutes before our shoot. Somehow, she turned the whole hour into a game, stayed incredibly patient, and delivered the sweetest family photos we’ve ever had.</p>
                                <span>The Miller Family - Golden Hour Portrait SEssion</span>
                            </Carousel.Caption>
                        </Carousel.Item>
                        <Carousel.Item>
                            <img
                                className="w-full h-100 object-cover rounded-lg"
                                src="https://picsum.photos/id/120/1200/800.jpg"
                                alt="First slide"
                            />
                            <Carousel.Caption>
                                <h3>Seamless production and exceptional brand delivery</h3>
                                <p>We hired her for our quarterly product launch shoot. Shot list execution was flawless, tethered previews kept our creative director aligned on set, and the post-production edits were delivered days ahead of schedule.</p>
                                <span>Alex Rivera - Head of Brand, Studio Simply Co.</span>
                            </Carousel.Caption>
                        </Carousel.Item>
                    </Carousel>
                </div>
                <Grid container spacing={{ xs: 1, md: 2 }} className="w-full max-w-6xl mx-auto mt-4 mb-4 py-2 bg-neutral-500 text-neutral-200 border-solid rounded-md">
                    <Grid size={6} className="flex items-center justify-center">
                        <Stack direction="row" className="items-center mx-auto">
                            <Typography variant="subtitle1" component="div">
                                4.8/5
                            </Typography>
                            <StarIcon className="text-amber-400" />
                            <Typography variant="subtitle2" component="div">
                                Rating across 120+ Verified Client Reviews
                            </Typography>
                        </Stack>
                    </Grid>
                    <Grid size={6} className="flex items-center justify-center">
                        <Stack direction="row" className="items-center mx-auto">
                            <PhotoCameraBackIcon className="text-neutral-100 mr-2" />
                            <Typography variant="subtitle2" component="div">
                                Featured in Test Weddings & Portraits
                            </Typography>
                        </Stack>
                    </Grid>
                </Grid>
            </div>
        </>
    );
}