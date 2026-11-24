import React from 'react';
import type { Photo } from '../interfaces/interfaces';
import { useCart } from '../context/CartContext';
import { Box, Button, ButtonGroup, Typography } from '@mui/material';

export const QuantitySelector: React.FC<{ photo: Photo, size: string }> = ({ photo, size }) => {
    const { updateQuantity, items } = useCart();
    const cartItem = items.find((item) => item.photo.id === photo.id && item.size === size);
    const quantity = cartItem?.quantity ?? 1;

    return (
        <Box className="inline-flex flex-row items-center border border-gray-300 rounded-full gap-2 overflow-hidden mt-2">
            <ButtonGroup variant="outlined" className="bg-inherit border-solid border-gray-300 min-w-4">
                <Button className="bg-inherit" variant="text" onClick={() => updateQuantity(photo.id, size, quantity - 1)}>
                    -
                </Button>
                <Typography className="text-neutral-800 flex items-center align-middle" variant="body2">
                    {quantity}
                </Typography>
                <Button className="bg-inherit text-neutral-500 rounded-full" variant="text" onClick={() => updateQuantity(photo.id, size, quantity + 1)}>
                    +
                </Button>
            </ButtonGroup>
        </Box>
    )
}