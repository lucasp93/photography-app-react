import React, { useState } from 'react'
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Stack from '@mui/material/Stack';
import CardMedia from '@mui/material/CardMedia';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import type { Photo } from '../interfaces/interfaces';
import { Button } from 'react-bootstrap';
import { useCart } from '../context/CartContext';
import { photoSizesArray, PhotoPriceArray } from '../constants/app.constant';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    maxWidth: '95vw',
    width: 900,
    maxHeight: '100vh',
    bgcolor: 'background.paper',
    border: '3px solid lightgrey',
    borderRadius: '10px',
    boxShadow: 34,
    p: 4,
    display: 'flex',
    flexDirection: 'column',
    gap: 1,
    alignItems: 'stretch',
    justifyContent: 'space-between',
};

export const PrintSizeModal: React.FC<{
    photo: Photo;
    size?: string;
    showAddToCartButton?: boolean;
    trigger?: React.ReactNode;
}> = ({ photo, size, trigger, showAddToCartButton = false }) => {
    const [open, setOpen] = useState<boolean>(false);
    const [photoSize, setPhotoSize] = useState<string | null>('15x20');
    const { addItem, updateSize } = useCart();
    const handleOpen = () => { setOpen(true) };
    const handleClose = () => { setOpen(false); };

    const handleSizeChange = (
        _event: React.MouseEvent<HTMLElement>,
        newSize: string | null,
    ) => {
        if (newSize === null) {
            return;
        }

        setPhotoSize(newSize);
    };

    const handleChangeSize = () => {
        // Get new size price
        const newPrice = PhotoPriceArray.find((item) => item.size === photoSize)?.price ?? 20;
        updateSize(photo.id, photoSize ? photoSize : '15x20', newPrice);
        setOpen(false);
    }

    const handleAddToCart = () => {
        if (photoSize === null) return;
        const photoPrice = PhotoPriceArray.find((item) => item.size === photoSize)?.price ?? 20; // Default price if not found
        addItem(photo, photoSize, photoPrice);
        handleClose();
    };
    return (
        <div>
            {trigger ? (
                <span onClick={handleOpen}>{trigger}</span>
            ) : (
                <Link href="#" color="inherit" className="text-bold" onClick={handleOpen}>Print {size}</Link>
            )}
            <div>
                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="print-size-modal"
                    aria-describedby="Photo print sizes"
                >
                    <Box sx={{ ...style, overflowY: 'auto' }}>
                        <div className="flex w-full flex-col md:flex-row gap-4">
                            <div className="w-full md:w-1/3">
                                <CardMedia
                                    component="img"
                                    className="w-full h-full object-cover rounded"
                                    //sx={{ width: 90, height: 90, objectFit: 'cover' }}
                                    image={photo.url}
                                    alt={photo.name}
                                />
                            </div>
                            <div className="w-full md:w-2/3">
                                <Typography variant="body1" className="font-bold">{photo.name}</Typography>
                                <Typography variant="body2" className="text-neutral-500">
                                    {photo.album_name}
                                </Typography>
                                {/* <Typography variant="subtitle1">Select photo size</Typography> */}
                                <Stack direction="row" spacing={4} className="block mt-2">
                                    <ToggleButtonGroup
                                        orientation="horizontal"
                                        value={photoSize}
                                        exclusive
                                        onChange={handleSizeChange}
                                        aria-label="photo size selector"
                                        sx={{
                                            display: 'flex',
                                            flexWrap: 'wrap',
                                            gap: 1,
                                        }}
                                    >
                                        {photoSizesArray.map((size) => (
                                            <ToggleButton key={size} value={size} className="border border-neutral-400 rounded-xl p-2">
                                                {size}
                                            </ToggleButton>
                                        ))}
                                    </ToggleButtonGroup>
                                </Stack>
                            </div>
                        </div>
                        {showAddToCartButton ?
                            (
                                <div className="flex flex-col items-center justify-end gap-2">
                                    <Button onClick={handleAddToCart}>Add to cart</Button>
                                </div>
                            ) :
                            (
                                <div className="flex flex-col items-center justify-end gap-2 mt-2">
                                    <Button onClick={handleChangeSize}>Change size</Button>
                                </div>
                            )
                        }
                    </Box>
                </Modal>
            </div>
        </div>
    )
};