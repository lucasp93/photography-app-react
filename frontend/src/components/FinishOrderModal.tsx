import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import Spinner from 'react-bootstrap/Spinner';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from '@mui/material/Modal';
import api from '../services/api';
import { ApiUrls } from '../utils/ApiUrls';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

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

// Standard regex patterns
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^\+[1-9]\d{1,3}\d{4,12}$/; // Django ISO 3166 1

interface FinishOrderFormProps {
    clientName: string;
    clientEmail: string;
    clientContact: string;
    items: any[];
    totalPrice: number;
}

export interface CreateOrderPayload {
    client_name: string;
    client_email: string;
    client_contact: string;
    photo_ids: (string | number)[];
    price: number;
}

const defaultCreateOrder = (order: CreateOrderPayload): Promise<unknown> =>
    api.apiPost(ApiUrls.createOrder, order);

export const FinishOrderModal: React.FC<{
    trigger?: React.ReactNode;
    onSubmitOrder?: (order: CreateOrderPayload) => Promise<unknown>;
}> = ({ trigger, onSubmitOrder = defaultCreateOrder }) => {
    const [open, setOpen] = useState(false);
    const handleOpen = () => { setOpen(true) };
    const handleClose = () => { setOpen(false) };
    const { items, totalPrice, clearCart } = useCart();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();
    const { user } = useAuth();

    const [touched, setTouched] = useState({
        email: false,
        contact: false,
    });

    const [formData, setFormData] = useState<FinishOrderFormProps>({
        clientName: user ? `${user.first_name} ${user.last_name}` : '',
        clientEmail: user ? user.email : '',
        clientContact: '',
        items: items.length > 0 ? items : [],
        totalPrice: totalPrice ? totalPrice : 0,
    });

    useEffect(() => {
        if (!user) return;

        setFormData((currentFormData) => ({
            ...currentFormData,
            clientName: `${user.first_name} ${user.last_name}`,
            clientEmail: user.email,
        }));
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (name === 'clientContact') setErrorMessage(null);
    };

    const handleBlur = (field: 'email' | 'contact') => {
        setTouched({ ...touched, [field]: true });
    };

    //Validation checks
    const isEmailInvalid = touched.email && !EMAIL_REGEX.test(formData.clientEmail);
    const isContactInvalid = touched.contact && !PHONE_REGEX.test(formData.clientContact);

    const handleFinishOrder = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Mark all as touched on submit check
        setTouched({ email: true, contact: true });

        if (!EMAIL_REGEX.test(formData.clientEmail) || !PHONE_REGEX.test(formData.clientContact)) {
            setLoading(false);
            return; // Stop submission if invalid
        }

        const newOrder = {
            client_name: formData.clientName,
            client_email: formData.clientEmail,
            client_contact: formData.clientContact,
            photo_ids: items.map((items) => items.photo.id),
            price: totalPrice,
        }

        try {
            // Create order
            await onSubmitOrder(newOrder);

            setSuccessMessage('Order created successfully!');
            clearCart();
            setOpen(false);
            navigate('/');
        } catch (err) {
            console.log('error message: ', errorMessage);
            console.log('Error creating order: ', err);
            setErrorMessage(`Error creating order, ${err}`);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            {trigger ? (
                <span onClick={handleOpen}>{trigger}</span>
            ) : (
                <Button variant="dark" onClick={handleOpen}>Finish order</Button>
            )
            }
            <div>
                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="finish-order-modal"
                    aria-describedby="Finish order modal for completing the purchase"
                >
                    <Box sx={style}>
                        <Stack className="flex flex-col gap-2">
                            {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
                            {successMessage && <Alert severity="success">{successMessage}</Alert>}
                            <Form className="flex flex-col gap-2" onSubmit={handleFinishOrder}>
                                <Form.Group controlId="formContactName">
                                    <Form.Label>Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="clientName"
                                        value={formData.clientName}
                                        onChange={handleChange}
                                        placeholder="Enter your name"
                                        required
                                    />
                                </Form.Group>
                                <Form.Group controlId="formEmail">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control
                                        type="email"
                                        name="clientEmail"
                                        value={formData.clientEmail}
                                        onChange={handleChange}
                                        placeholder="name@example.com"
                                        onBlur={() => handleBlur("email")}
                                        isInvalid={isEmailInvalid}
                                        required
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        Please provide a valid email address.
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group controlId="formClientContact">
                                    <Form.Label>Contact</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="clientContact"
                                        value={formData.clientContact}
                                        onChange={handleChange}
                                        placeholder="+33612345678"
                                        title="Enter a phone number in international format, such as +33612345678."
                                        onBlur={() => handleBlur("contact")}
                                        isInvalid={isContactInvalid}
                                        required
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        Enter a valid phone number.
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Typography variant="body1" sx={{ marginTop: '10px' }}>
                                    Total Price: $ {totalPrice.toFixed(2)}
                                </Typography>
                                <div className="flex flex-col items-center justify-center gap-2">
                                    <Button
                                        className="mt-2 border rounded-full"
                                        variant="dark"
                                        size="lg"
                                        type="submit"
                                        disabled={loading || items.length === 0}
                                    >
                                        {loading ? (
                                            <>
                                                <Spinner animation="border" size="sm" className="me-2" />
                                                Processing...
                                            </>
                                        ) : (
                                            "Complete Order"
                                        )
                                        }
                                    </Button>
                                    {/* <Link href="/login" sx={{ fontSize: '15px', color: 'grey', textDecoration: 'none', '&:hover': { color: 'lightgrey', textDecoration: 'none' } }}>
                                Already have an account? Log in
                            </Link> */}
                                    {/* <Typography variant="body2">
                                    {errorMessage && <p className="text-sm text-red-500">{errorMessage}</p>}
                                    {successMessage && <p className="text-sm text-green-500">{successMessage}</p>}
                                </Typography> */}
                                </div>
                            </Form>
                        </Stack>
                    </Box>
                </Modal>
            </div>
        </div>
    )
};