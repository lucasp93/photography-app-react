import React, { useState } from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListSubheader from '@mui/material/ListSubheader';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import IconButton from '@mui/material/IconButton';
import Drawer from '@mui/material/Drawer';
import CartBadge from '@mui/material/Badge';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import Button from 'react-bootstrap/Button';
import { CartPhotoItem } from './CartPhotoItem';
import type { Photo } from '../interfaces/interfaces';

export const DrawerContent: React.FC = () => {
    const [open, setOpen] = useState(false);

    const toggleDrawer = (newOpen: boolean) => () => {
        setOpen(newOpen);
    };

    const photosTest: Photo[] = [{
        id: 50,
        name: "Mountain",
        author: "Mark",
        featured: true,
        is_favorited: false,
        url: "https://picsum.photos/id/235/1200/800.jpg",
        album_id: 1,
        album_name: "johnandjane",
    },
    {
        id: 51,
        name: "Beach",
        author: "Tom",
        featured: false,
        is_favorited: false,
        url: "https://picsum.photos/id/240/1200/800.jpg",
        album_id: 7,
        album_name: "company expansion",
    }
    ]

    const DrawerItems = (
        <Box sx={{ width: 400, maxWidth: '100%', display: 'flex', flexDirection: 'column', height: '100%' }} role="presentation">
            {/* <List>
                {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
                    <ListItem key={text} disablePadding>
                        <ListItemButton>
                            <ListItemIcon>
                                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                            </ListItemIcon>
                            <ListItemText primary={text} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List> */}
            <title>Shopping Bag</title>
            <List
                sx={{
                    width: '100%',
                    maxWidth: 400,
                    bgcolor: 'background.paper',
                    position: 'relative',
                    overflow: 'auto',
                    height: '100%',
                    '& ul': { padding: 0 },
                }}
                subheader={<li />}
            >
                <ListSubheader>My Cart</ListSubheader>
                <Divider />
                {photosTest.map((photo) => (
                    <CartPhotoItem key={`section-${photo.id}`} photo={photo} />
                ))}
            </List>
            <Divider />
            <Container className="flex flex-col align-center items-center w-full px-4 py-4">
                <div className="flex justify-space-between gap-2 mb-2">
                    <span>TOTAL</span>
                    <span>$183.999</span>
                </div>
                <Button variant="dark" className="w-full border rounded-full">Finish Order</Button>
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginTop: '15px' }}>
                    <Link
                        href="#"
                        onClick={(event) => {
                            event.preventDefault();
                            setOpen(false);
                        }}
                        sx={{ fontSize: '15px', color: 'grey', textDecoration: 'none', '&:hover': { color: 'lightgrey', textDecoration: 'none' } }}>
                        &lt; Keep Shopping
                    </Link>
                    <Link
                        href="/checkout/cart"
                        sx={{ fontSize: '15px', color: 'grey', textDecoration: 'none', '&:hover': { color: 'lightgrey', textDecoration: 'none' } }}>
                        Checkout &gt;
                    </Link>
                </div>
            </Container>
        </Box>
    )

    return (
        <div>
            <IconButton size="medium" color="inherit" aria-label="ShoppingBag" onClick={toggleDrawer(true)}>
                <ShoppingBagIcon className="text-neutral-200" fontSize="medium" />
                <CartBadge badgeContent={1} color="error" overlap="circular" sx={{ top: '-13px', right: '-1px' }} />
            </IconButton>
            <Drawer
                open={open}
                onClose={(_event, reason) => {
                    if (reason === 'backdropClick') setOpen(false);
                }}
                anchor="right"
            >
                {DrawerItems}
            </Drawer>
        </div>
    )
}