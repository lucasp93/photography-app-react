import React, { useState } from 'react';
import type { Photo } from '../interfaces/interfaces';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Modal from '@mui/material/Modal';
import Divider from '@mui/material/Divider';
import Button from 'react-bootstrap/Button';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import ImageIcon from '@mui/icons-material/Image';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

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

export const PhotoListModal: React.FC<{
    photos: Photo[],
    trigger?: React.ReactNode
}> = ({ photos, trigger }) => {
    const [open, setOpen] = useState<boolean>(false);
    const handleOpen = () => { setOpen(true) };
    const handleClose = () => { setOpen(false) };

    console.log('photos: ', photos);

    return (
        <div>
            {trigger ? (
                <span onClick={handleOpen}>{trigger}</span>
            ) : (
                <Button onClick={handleOpen} className="mb-2">
                    <ImageIcon />
                </Button>
                // <Link href="#" color="inherit" className="text-bold" onClick={handleOpen}>Print {size}</Link>
            )}
            <div>
                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="photo-list-modal"
                    aria-describedby="List of order's photos"
                >
                    <Box sx={style}>
                        <Stack className="flex flex-col gap-2">
                            <List className="w-full">
                                <Typography className="text-center" variant="h5">
                                    {photos.length > 1 ?
                                        'Photos'
                                        :
                                        'Photo'
                                    }
                                </Typography>
                                <Divider orientation="horizontal" className="border-solid border-neutral-600" />
                                {photos.length > 0 ?
                                    photos.map((photo, index) => (
                                        <ListItem
                                            key={photo.id}
                                            alignItems="flex-start"
                                            divider={index < photos.length - 1}
                                        >
                                            <ListItemAvatar>
                                                <Avatar alt={photo.name} src={photo.url} />
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={photo.name}
                                                secondary={
                                                    <React.Fragment>
                                                        <Typography
                                                            component="span"
                                                            variant="body2"
                                                            sx={{ color: "text.primary", display: "inline" }}
                                                        >
                                                            {photo.album_name}
                                                        </Typography>
                                                        {` - ${photo.album_author}`}
                                                    </React.Fragment>
                                                }
                                            />
                                        </ListItem>
                                    )) : "No photos in order."}
                            </List>
                        </Stack>
                    </Box>
                </Modal>
            </div>
        </div>
    )
};