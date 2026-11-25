import React from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Button from 'react-bootstrap/Button';
import Link from '@mui/material/Link';
import { CartPhotoItem } from '../components/CartPhotoItem';
import { ListItem, ListSubheader } from '@mui/material';
import { ListGroup, ListGroupItem } from 'react-bootstrap';
import { useCart } from '../context/CartContext';
import { FinishOrderModal } from '../components/FinishOrderModal';

export const CheckoutPage: React.FC = () => {
    const { items, totalPrice } = useCart();

    return (
        <>
            <Box className="flex flex-col gap-2 p-3 w-full max-w-6xl m-auto">
                <Stack spacing={3} direction={{ xs: 'column', md: 'row' }} className="justify-between">
                    <Box component="section" className="w-full md:w-2/3">
                        <List>
                            <ListSubheader sx={{ fontColor: 'darkGrey', fontSize: '1.5rem', marginBottom: '4px' }}>
                                Cart Items ({items?.length} {items.length > 1 ? 'photos' : 'photo'})
                            </ListSubheader>
                            <ListGroup>
                                {items.map((item) => (
                                    <ListGroupItem key={`item-${item.photo.id}`}>
                                        <CartPhotoItem photo={item.photo} size={item.size} component='cart' />
                                    </ListGroupItem>
                                ))}
                            </ListGroup>
                        </List>
                    </Box>
                    <Box component="section" className="w-full md:w-1/3">
                        <List>
                            <ListSubheader sx={{ fontColor: 'darkGrey', fontSize: '1.5rem', marginBottom: '4px' }}>Resume</ListSubheader>
                            <Divider />
                            <div className="border border-neutral-400 rounded-xl p-2 bg-white">
                                <ListGroupItem>
                                    <ListItem className="flex flex-row px-4" sx={{ justifyContent: 'space-between' }}>
                                        <p>Subtotal</p>
                                        <span>$ {totalPrice.toFixed(2)}</span>
                                    </ListItem>
                                    <ListItem className="flex flex-row px-4" sx={{ justifyContent: 'space-between' }}>
                                        <p>Discount</p>
                                        <span>$ 0.00</span>
                                    </ListItem>
                                    <ListItem className="flex flex-row px-4" sx={{ justifyContent: 'space-between' }}>
                                        <p>Total</p>
                                        <span>$ {totalPrice.toFixed(2)}</span>
                                    </ListItem>
                                    <ListItem className="flex flex-col">
                                        <FinishOrderModal
                                            trigger={
                                                <Button variant="dark" className="w-full border rounded-full">Finish order</Button>
                                            }
                                        />
                                    </ListItem>
                                    <ListItem className="flex flex-col">
                                        <Link href="/" sx={{ fontSize: '15px', color: 'grey', textDecoration: 'none', '&:hover': { color: 'lightgrey', textDecoration: 'none' } }}>
                                            Keep shopping &gt;
                                        </Link>
                                    </ListItem>
                                </ListGroupItem>
                            </div>
                        </List>
                    </Box>
                </Stack>
            </Box>
        </>
    );
};