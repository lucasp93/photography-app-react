import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { DrawerContent } from './DrawerContent';
import { useCart } from '../context/CartContext';
import type { Photo } from '../interfaces/interfaces';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}));

jest.mock('../context/CartContext', () => ({
    useCart: jest.fn(),
}));

jest.mock('./CartPhotoItem', () => ({
    CartPhotoItem: ({ photo, size }: { photo: Photo; size: string }) => (
        <div data-testid={`cart-photo-item-${photo.id}`}>
            {photo.name} ({size})
        </div>
    ),
}));

const mockedUseCart = useCart as jest.MockedFunction<typeof useCart>;

const mockPhoto: Photo = {
    id: 101,
    name: 'Sunset Shot',
    author: 'John Doe',
    featured: true,
    is_favorited: false,
    album: null,
    url: 'https://example.com/photo1.jpg',
    album_id: 1,
    album_name: 'Summer Wedding',
    album_author: 'John Doe',
    size: '15x20',
};

describe('DrawerContent Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockedUseCart.mockReturnValue({
            items: [
                {
                    photo: mockPhoto,
                    size: '15x20',
                    price: 22,
                    quantity: 2,
                },
            ],
            totalPrice: 44,
            itemCount: 2,
        } as unknown as ReturnType<typeof useCart>);
    });

    test('renders shopping bag button with item count badge', () => {
        render(<DrawerContent />);

        expect(screen.getByLabelText('ShoppingBag')).toBeInTheDocument();
        expect(screen.getByText('2')).toBeInTheDocument();
    });

    test('opens drawer on click and displays cart items and total price', () => {
        render(<DrawerContent />);

        fireEvent.click(screen.getByLabelText('ShoppingBag'));

        expect(screen.getByText('My Cart')).toBeInTheDocument();
        expect(screen.getByTestId('cart-photo-item-101')).toHaveTextContent('Sunset Shot (15x20)');
        expect(screen.getByText('$44.00')).toBeInTheDocument();
    });

    test('displays empty cart message when there are no items', () => {
        mockedUseCart.mockReturnValue({
            items: [],
            totalPrice: 0,
            itemCount: 0,
        } as unknown as ReturnType<typeof useCart>);

        render(<DrawerContent />);
        fireEvent.click(screen.getByLabelText('ShoppingBag'));

        expect(screen.getByText('Cart is empty')).toBeInTheDocument();
        expect(screen.getByText('$0')).toBeInTheDocument();
    });

    test('closes drawer and navigates to checkout when Finish Order is clicked', async () => {
        render(<DrawerContent />);

        fireEvent.click(screen.getByLabelText('ShoppingBag'));
        fireEvent.click(screen.getByRole('button', { name: 'Finish Order' }));

        expect(mockNavigate).toHaveBeenCalledWith('/checkout/cart');
        await waitFor(() => {
            expect(screen.queryByText('My Cart')).not.toBeInTheDocument();
        });
    });

    test('closes drawer when Keep Shopping link is clicked', async () => {
        render(<DrawerContent />);

        fireEvent.click(screen.getByLabelText('ShoppingBag'));
        expect(screen.getByText('My Cart')).toBeVisible();

        fireEvent.click(screen.getByText('< Keep Shopping'));
        await waitFor(() => {
            expect(screen.queryByText('My Cart')).not.toBeInTheDocument();
        });
    });
});
