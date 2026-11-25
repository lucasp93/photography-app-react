import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import { ListGroup, ListGroupItem } from 'react-bootstrap';
import Divider from '@mui/material/Divider';
import ListSubheader from '@mui/material/ListSubheader';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import IconButton from '@mui/material/IconButton';
import Drawer from '@mui/material/Drawer';
import CartBadge from '@mui/material/Badge';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Button from 'react-bootstrap/Button';
import { CartPhotoItem } from './CartPhotoItem';
import { useCart } from '../context/CartContext';


export const DrawerContent: React.FC = () => {
    const [open, setOpen] = useState(false);
    const { items, totalPrice, itemCount } = useCart();
    const toggleDrawer = (newOpen: boolean) => () => {
        setOpen(newOpen);
    };

    const navigate = useNavigate();

    const DrawerItems = (
        <Box sx={{ width: 400, maxWidth: '100%', display: 'flex', flexDirection: 'column', height: '100%' }} role="presentation">
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
                <ListGroup>
                    {items.length > 0 ? (
                        items.map((item) => (
                            <ListGroupItem key={item.photo.id}>
                                <CartPhotoItem key={`section-${item.photo.id}`} photo={item.photo} size={item.size} component='drawer' />
                            </ListGroupItem>
                        ))
                    ) : (
                        <Typography variant="body2" className="text-center">Cart is empty </Typography>
                    )}
                </ListGroup>
            </List>
            <Divider />
            <Container className="flex flex-col align-center items-center w-full px-4 py-4">
                <div className="flex justify-between w-full gap-2 mb-2">
                    <span>TOTAL</span>
                    <span>${totalPrice > 0 ? totalPrice.toFixed(2) : 0.00}</span>
                </div>
                <Button
                    variant="dark"
                    className="w-full border rounded-full"
                    onClick={() => {
                        setOpen(false);
                        navigate('/checkout/cart');
                    }}
                >Finish Order</Button>
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
                <CartBadge badgeContent={itemCount} color="error" overlap="circular" sx={{ top: '-13px', right: '-1px' }} />
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