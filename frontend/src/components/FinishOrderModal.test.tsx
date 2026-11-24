import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { FinishOrderModal } from './FinishOrderModal';
import api from '../services/api';
import { ApiUrls } from '../utils/ApiUrls';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import type { Order, Photo, Album } from '../interfaces/interfaces';

const mockNavigate = jest.fn()

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}));

jest.mock('../services/api', () => ({
    __esModule: true,
    default: {
        apiPost: jest.fn(),
    }
}));

jest.mock('../context/CartContext', () => ({
    useCart: jest.fn(),
}));

jest.mock('../context/AuthContext', () => ({
    useAuth: jest.fn(),
}));

const mockedApiPost = api.apiPost as jest.MockedFunction<typeof api.apiPost>;
const mockedUseCart = useCart as jest.MockedFunction<typeof useCart>;
const mockedUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;
const mockClearCart = jest.fn();

const mockAlbum: Album = {
    id: 1,
    name: 'Summer Wedding',
    event: 'Wedding',
    author: 'John Doe',
};

const mockFeaturedPhotos: Photo[] = [
    {
        id: 101,
        name: 'Sunset Shot',
        author: 'John Doe',
        featured: true,
        is_favorited: false,
        album: mockAlbum,
        url: 'https://example.com/photo1.jpg',
        album_id: 1,
        album_name: 'Summer Wedding',
        album_author: 'John Doe',
        size: '15x20',
    },
];

const mockOrder: Order = {
    id: 15,
    photos: mockFeaturedPhotos,
    order_number: 'ORDER-123456-ABC',
    client_name: 'test',
    client_email: 'test@test.com',
    client_contact: '+33612345678',
    price: 150
};

const mockCartItems = [
    {
        photo: mockFeaturedPhotos[0],
        quantity: 1,
    },
];

describe('FinishOrderModal Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.spyOn(console, 'log').mockImplementation(() => {});

        mockedUseCart.mockReturnValue({
            items: mockCartItems,
            totalPrice: 150,
            clearCart: mockClearCart,
        } as unknown as ReturnType<typeof useCart>);

        mockedUseAuth.mockReturnValue({
            user: null,
        } as unknown as ReturnType<typeof useAuth>);
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test('renders default trigger button and opens modal on click', () => {
        render(<FinishOrderModal />);

        const triggerBtn = screen.getByRole('button', { name: 'Finish order' });
        expect(triggerBtn).toBeInTheDocument();

        fireEvent.click(triggerBtn);
        expect(screen.getByLabelText('Name')).toBeInTheDocument();
        expect(screen.getByText('Total Price: $ 150.00')).toBeInTheDocument();
    });

    test('renders custom trigger and opens modal on click', () => {
        render(<FinishOrderModal trigger={<button type="button">Checkout Now</button>} />);

        const customTrigger = screen.getByRole('button', { name: 'Checkout Now' });
        fireEvent.click(customTrigger);

        expect(screen.getByRole('button', { name: 'Complete Order' })).toBeInTheDocument();
    });

    test('pre-fills name and email when user is authenticated', () => {
        mockedUseAuth.mockReturnValue({
            user: {
                id: 1,
                username: 'jdoe',
                first_name: 'Jane',
                last_name: 'Doe',
                email: 'jane.doe@example.com',
                role: 'user',
            },
        } as unknown as ReturnType<typeof useAuth>);

        render(<FinishOrderModal />);
        fireEvent.click(screen.getByRole('button', { name: 'Finish order' }));

        expect(screen.getByLabelText('Name')).toHaveValue('Jane Doe');
        expect(screen.getByLabelText('Email')).toHaveValue('jane.doe@example.com');
    });

    test('disables Complete Order button when cart is empty', () => {
        mockedUseCart.mockReturnValue({
            items: [],
            totalPrice: 0,
            clearCart: mockClearCart,
        } as unknown as ReturnType<typeof useCart>);

        render(<FinishOrderModal />);
        fireEvent.click(screen.getByRole('button', { name: 'Finish order' }));

        expect(screen.getByRole('button', { name: 'Complete Order' })).toBeDisabled();
    });

    test('shows validation error for invalid email and blocks submission', () => {
        render(<FinishOrderModal />);
        fireEvent.click(screen.getByRole('button', { name: 'Finish order' }));

        fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'test' } });
        fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'invalid-email' } });
        fireEvent.blur(screen.getByLabelText('Email'));
        fireEvent.change(screen.getByLabelText('Contact'), { target: { value: '+33612345678' } });

        expect(screen.getByText('Please provide a valid email address.')).toBeInTheDocument();

        fireEvent.submit(screen.getByRole('button', { name: 'Complete Order' }).closest('form')!);
        expect(mockedApiPost).not.toHaveBeenCalled();
    });

    test('shows validation error for invalid phone number and blocks submission', () => {
        render(<FinishOrderModal />);
        fireEvent.click(screen.getByRole('button', { name: 'Finish order' }));

        fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'test' } });
        fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@test.com' } });
        fireEvent.change(screen.getByLabelText('Contact'), { target: { value: '12345' } });
        fireEvent.blur(screen.getByLabelText('Contact'));

        expect(screen.getByText('Enter a valid phone number.')).toBeInTheDocument();

        fireEvent.submit(screen.getByRole('button', { name: 'Complete Order' }).closest('form')!);
        expect(mockedApiPost).not.toHaveBeenCalled();
    });

    test('submits order, clears cart, closes modal, and navigates home on success', async () => {
        mockedApiPost.mockResolvedValueOnce(mockOrder);

        render(<FinishOrderModal />);
        fireEvent.click(screen.getByRole('button', { name: 'Finish order' }));

        fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'test' } });
        fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@test.com' } });
        fireEvent.change(screen.getByLabelText('Contact'), { target: { value: '+33612345678' } });

        fireEvent.click(screen.getByRole('button', { name: 'Complete Order' }));

        await waitFor(() => {
            expect(mockedApiPost).toHaveBeenCalledWith(ApiUrls.createOrder, {
                client_name: 'test',
                client_email: 'test@test.com',
                client_contact: '+33612345678',
                photo_ids: [101],
                price: 150,
            });
        });

        await waitFor(() => {
            expect(mockClearCart).toHaveBeenCalledTimes(1);
            expect(mockNavigate).toHaveBeenCalledWith('/');
            expect(screen.queryByLabelText('Name')).not.toBeInTheDocument();
        });
    });

    test('shows loading spinner while order request is pending', async () => {
        mockedApiPost.mockReturnValueOnce(new Promise(() => {}));

        render(<FinishOrderModal />);
        fireEvent.click(screen.getByRole('button', { name: 'Finish order' }));

        fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'test' } });
        fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@test.com' } });
        fireEvent.change(screen.getByLabelText('Contact'), { target: { value: '+33612345678' } });

        fireEvent.click(screen.getByRole('button', { name: 'Complete Order' }));

        expect(await screen.findByText('Processing...')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Processing.../i })).toBeDisabled();
    });

    test('displays error alert when API call fails', async () => {
        mockedApiPost.mockRejectedValueOnce(new Error('Network error'));

        render(<FinishOrderModal />);
        fireEvent.click(screen.getByRole('button', { name: 'Finish order' }));

        fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'test' } });
        fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@test.com' } });
        fireEvent.change(screen.getByLabelText('Contact'), { target: { value: '+33612345678' } });

        fireEvent.click(screen.getByRole('button', { name: 'Complete Order' }));

        await waitFor(() => {
            expect(screen.getByRole('alert')).toHaveTextContent('Error creating order, Error: Network error');
        });

        expect(mockClearCart).not.toHaveBeenCalled();
        expect(mockNavigate).not.toHaveBeenCalled();
    });
});

