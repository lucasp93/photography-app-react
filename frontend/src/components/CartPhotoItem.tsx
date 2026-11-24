import React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import CardMedia from '@mui/material/CardMedia';
import IconButton from '@mui/material/IconButton';
import type { Photo } from '../interfaces/interfaces';
import { PrintSizeModal } from './PrintSizeModal';
import { useCart } from '../context/CartContext';
import { QuantitySelector } from './QuantitySelector';

interface CardPhotoItemProps {
    photo: Photo;
    size: string;
    component: string;
    extraContent?: React.ReactNode;
}

interface VariantLayoutConfig {
    quantityPlacement: 'media' | 'details';
    titleVariant: 'body1' | 'body2';
    showSizeModal: boolean;
}

const VARIANT_CONFIG: Record<string, VariantLayoutConfig> = {
    drawer: {
        quantityPlacement: 'details',
        titleVariant: 'body2',
        showSizeModal: false,
    },
    cart: {
        quantityPlacement: 'media',
        titleVariant: 'body1',
        showSizeModal: true,
    },
};

export const CartPhotoItem: React.FC<CardPhotoItemProps> = ({
    photo,
    size,
    component,
    extraContent,
}) => {
    const { removeItem, items } = useCart();
    const cartItem = items.find((item) => item.photo.id === photo.id && item.size === size);
    const itemTotal = cartItem ? cartItem.price * cartItem.quantity : 0;
    const config = VARIANT_CONFIG[component];

    if (!config) {
        return (
            <Card className="grid w-full grid-cols-[96px_minmax(0,1fr)_72px] items-center gap-3 rounded-none border-gray-200 px-2 py-3 shadow-none">
                <p>Unexpected component name, allowed are ['cart', 'drawer']</p>
            </Card>
        );
    }

    return (
        <Card className="grid w-full grid-cols-[96px_minmax(0,1fr)_72px] items-center gap-3 rounded-none border-gray-200 px-2 py-3 shadow-none">
            <Box className="flex flex-col items-center">
                <CardMedia
                    component="img"
                    sx={{ width: 90, height: 90, objectFit: 'cover' }}
                    image={photo.url}
                    alt={photo.name}
                />
                {config.quantityPlacement === 'media' && <QuantitySelector photo={photo} size={size} />}
            </Box>

            <Box className="flex flex-col items-start h-full min-w-0 text-start">
                <CardContent className="flex flex-col flex-1 gap-0 p-0">
                    <Typography variant={config.titleVariant}>{photo.name}</Typography>
                    <Typography variant="body2" className="text-neutral-500">
                        {photo.album_name}
                    </Typography>
                    {config.showSizeModal && (
                        <PrintSizeModal key={photo.id} photo={photo} size={size} showAddToCartButton={false} />
                    )}
                    {extraContent}
                </CardContent>
                {config.quantityPlacement === 'details' && <QuantitySelector photo={photo} size={size} />}
            </Box>

            <Box className="flex flex-col justify-start items-center gap-2 h-full">
                <IconButton aria-label="trash" size="small" onClick={() => removeItem(photo.id, size)}>
                    <DeleteOutlinedIcon fontSize="small" />
                </IconButton>
                <Typography className="whitespace-nowrap text-neutral-500" variant="body2">
                    ${itemTotal > 0 ? itemTotal.toFixed(2) : 0.00}
                </Typography>
            </Box>
        </Card>
    );
};
