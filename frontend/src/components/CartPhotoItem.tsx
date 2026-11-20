import React from 'react';
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
import { PrintSizeModal } from './PrintSizeModal';
import { useCart } from '../context/CartContext';

interface CardPhotoItemProps {
    photo: Photo;
    size: string;
    price?: number;
    component: string;
}

const QuantitySelector: React.FC<{ photo: Photo, size: string }> = ({ photo, size }) => {
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

export const CartPhotoItem: React.FC<CardPhotoItemProps> = ({ photo, size, price, component }) => {
    const { removeItem, items } = useCart();
    const cartItem = items.find((item) => item.photo.id === photo.id && item.size === size);
    const itemTotal = cartItem ? cartItem.price * cartItem.quantity : 0;
    return (
        <Card className="grid w-full grid-cols-[96px_minmax(0,1fr)_72px] items-center gap-3 rounded-none border-gray-200 px-2 py-3 shadow-none">
            {component === 'drawer' ?
                <>
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
                        <QuantitySelector photo={photo} size={size} />
                    </Box>

                    <Box className="flex flex-col items-center gap-2 justify-start">
                        <IconButton aria-label="trash" size="small" onClick={() => removeItem(photo.id, size)}>
                            <DeleteOutlinedIcon fontSize="small" />
                        </IconButton>
                        <Typography className="whitespace-nowrap text-neutral-500" variant="body2">
                            ${itemTotal > 0 ? itemTotal.toFixed(2) : 0.00}
                        </Typography>
                    </Box>
                </>
                : component === 'cart' ?
                    <>
                        <Box className="flex flex-col items-center">
                            <CardMedia
                                component="img"
                                sx={{ width: 90, height: 90, objectFit: 'cover' }}
                                image={photo.url}
                                alt={photo.name}
                            />
                            <QuantitySelector photo={photo} size={size} />
                        </Box>

                        <Box className="flex flex-col items-start h-full min-w-0 text-start">
                            <CardContent className="flex flex-col flex-1 p-0">
                                <Typography variant="body1">{photo.name}</Typography>
                                <Typography variant="body2" className="text-neutral-500">
                                    {photo.album_name}
                                </Typography>
                                {/* <Typography variant="body2" className="text-neutral-500"> */}
                                <PrintSizeModal key={photo.id} photo={photo} size={size} showAddToCartButton={false} />
                                {/* </Typography> */}
                            </CardContent>
                        </Box>

                        <Box className="flex flex-col justify-start items-center gap-2 h-full">
                            <IconButton aria-label="trash" size="small" onClick={() => removeItem(photo.id, size)}>
                                <DeleteOutlinedIcon fontSize="small" />
                            </IconButton>
                            <Typography className="whitespace-nowrap text-neutral-500" variant="body2">
                                ${itemTotal > 0 ? itemTotal.toFixed(2) : 0.00}
                            </Typography>
                        </Box>
                    </>
                    :
                    <p>Unexpected component name, allowed are ['cart', 'drawer']</p>
            }
        </Card>
    )
}