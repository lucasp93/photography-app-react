import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CartPhotoItem } from './CartPhotoItem';
import { useCart } from '../context/CartContext';
import type { Photo } from '../interfaces/interfaces';

jest.mock('../context/CartContext', () => ({
    useCart: jest.fn(),
}));

jest.mock('./PrintSizeModal', () => ({
    PrintSizeModal: ({ size }: { size?: string }) => (
        <div data-testid="print-size-modal">Print {size}</div>
    ),
}));

const mockedUseCart = useCart as jest.MockedFunction<typeof useCart>;
const mockUpdateQuantity = jest.fn();
const mockRemoveItem = jest.fn();

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

describe('CartPhotoItem Component', () => {
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
            updateQuantity: mockUpdateQuantity,
            removeItem: mockRemoveItem,
        } as unknown as ReturnType<typeof useCart>);
    });

    test('renders drawer layout with photo details, quantity, and total price', () => {
        render(<CartPhotoItem photo={mockPhoto} size="15x20" component="drawer" />);

        expect(screen.getByText('Sunset Shot')).toBeInTheDocument();
        expect(screen.getByText('Summer Wedding')).toBeInTheDocument();
        expect(screen.getByRole('img', { name: 'Sunset Shot' })).toHaveAttribute(
            'src',
            'https://example.com/photo1.jpg'
        );
        expect(screen.getByText('2')).toBeInTheDocument();
        expect(screen.getByText('$44.00')).toBeInTheDocument();
        expect(screen.queryByTestId('print-size-modal')).not.toBeInTheDocument();
    });

    test('renders cart layout with PrintSizeModal', () => {
        render(<CartPhotoItem photo={mockPhoto} size="15x20" component="cart" />);

        expect(screen.getByText('Sunset Shot')).toBeInTheDocument();
        expect(screen.getByTestId('print-size-modal')).toHaveTextContent('Print 15x20');
        expect(screen.getByText('$44.00')).toBeInTheDocument();
    });

    test('renders fallback message for unexpected component prop', () => {
        render(<CartPhotoItem photo={mockPhoto} size="15x20" component="unknown" />);

        expect(
            screen.getByText("Unexpected component name, allowed are ['cart', 'drawer']")
        ).toBeInTheDocument();
    });

    test('increments and decrements quantity via QuantitySelector buttons', () => {
        render(<CartPhotoItem photo={mockPhoto} size="15x20" component="drawer" />);

        fireEvent.click(screen.getByRole('button', { name: '+' }));
        expect(mockUpdateQuantity).toHaveBeenCalledWith(101, '15x20', 3);

        fireEvent.click(screen.getByRole('button', { name: '-' }));
        expect(mockUpdateQuantity).toHaveBeenCalledWith(101, '15x20', 1);
    });

    test('calls removeItem when trash button is clicked', () => {
        render(<CartPhotoItem photo={mockPhoto} size="15x20" component="cart" />);

        fireEvent.click(screen.getByLabelText('trash'));
        expect(mockRemoveItem).toHaveBeenCalledWith(101, '15x20');
    });

    test('shows $0 when matching cart item is not found', () => {
        mockedUseCart.mockReturnValue({
            items: [],
            updateQuantity: mockUpdateQuantity,
            removeItem: mockRemoveItem,
        } as unknown as ReturnType<typeof useCart>);

        render(<CartPhotoItem photo={mockPhoto} size="15x20" component="drawer" />);

        expect(screen.getByText('$0')).toBeInTheDocument();
        expect(screen.getByText('1')).toBeInTheDocument();
    });
});
