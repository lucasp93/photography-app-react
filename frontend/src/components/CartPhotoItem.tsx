import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import CardMedia from '@mui/material/CardMedia';
import IconButton from '@mui/material/IconButton';
import ButtonGroup from '@mui/material/ButtonGroup';
import Button from '@mui/material/Button';
import type { Photo } from '../interfaces/interfaces';

interface CardPhotoItemProps {
    photo: Photo;
}

const QuantitySelector: React.FC = () => {
    const [count, setCount] = useState<number>(1);

    return (
        <Box className="inline-flex flex-row items-center border border-gray-300 rounded-full gap-2 overflow-hidden">
            <ButtonGroup variant="outlined" className="bg-inherit border-solid border-gray-300 min-w-4 px-2">
                <Button className="bg-inherit" variant="text" onClick={() => setCount(Math.max(1, count - 1))}>
                    -
                </Button>
                <Typography className="text-neutral-800 flex items-center align-middle" variant="body2">
                    {count}
                </Typography>
                {/* <Button className="font-bold text-neutral-800" variant="text">
                    {count}
                </Button> */}
                <Button className="bg-inherit text-neutral-500 rounded-full" variant="text" onClick={() => setCount(count + 1)}>
                    +
                </Button>
            </ButtonGroup>
        </Box>
    )
}

export const CartPhotoItem: React.FC<CardPhotoItemProps> = ({ photo }) => {
    console.log('photo: ', photo)

    return (
        <Card className="grid w-full max-h-40 grid-cols-[96px_minmax(0,1fr)_72px] items-center gap-3 rounded-none border-b border-gray-200 px-2 py-3 shadow-none">
            <CardMedia
                component="img"
                sx={{ width: 90, height: 90, objectFit: 'cover' }}
                image={photo.url}
                alt={photo.name}
            />

            <Box className="flex min-w-0 flex-col items-start justify-start">
                <CardContent className="flex flex-col gap-0 p-0">
                    <Typography variant="body2">{photo.name}</Typography>
                    <Typography variant="body2" className="text-neutral-500">
                        {photo.album_name}
                    </Typography>
                </CardContent>
                <QuantitySelector />
            </Box>

            <Box className="flex flex-col items-center gap-2 justify-start">
                <IconButton aria-label="trash" size="small">
                    <DeleteOutlinedIcon fontSize="small" />
                </IconButton>
                <Typography className="whitespace-nowrap text-neutral-500" variant="body2">
                    $183.999
                </Typography>
            </Box>
        </Card>
    )
}