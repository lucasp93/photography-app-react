import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { PrintSizeModal } from './PrintSizeModal';
import { useCart } from '../context/CartContext';
import type { Photo } from '../interfaces/interfaces';

jest.mock('../context/CartContext', () => ({
    useCart: jest.fn(),
}));

const mockedUseCart = useCart as jest.MockedFunction<typeof useCart>;
const mockAddItem = jest.fn();
const mockUpdateSize = jest.fn();

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

describe('PrintSizeModal Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockedUseCart.mockReturnValue({
            addItem: mockAddItem,
            updateSize: mockUpdateSize,
        } as unknown as ReturnType<typeof useCart>);
    });

    test('renders default trigger link and opens modal on click', () => {
        render(<PrintSizeModal photo={mockPhoto} size="15x20" />);

        const triggerLink = screen.getByText('Print 15x20');
        expect(triggerLink).toBeInTheDocument();

        fireEvent.click(triggerLink);

        expect(screen.getByText('Sunset Shot')).toBeInTheDocument();
        expect(screen.getByText('Summer Wedding')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Change size' })).toBeInTheDocument();
    });

    test('renders custom trigger when provided', () => {
        render(
            <PrintSizeModal
                photo={mockPhoto}
                showAddToCartButton={true}
                trigger={<button type="button">Select Size</button>}
            />
        );

        fireEvent.click(screen.getByRole('button', { name: 'Select Size' }));
        expect(screen.getByRole('button', { name: 'Add to cart' })).toBeInTheDocument();
    });

    test('selects a size and calls addItem when Add to cart is clicked', () => {
        render(<PrintSizeModal photo={mockPhoto} showAddToCartButton={true} />);

        fireEvent.click(screen.getByText('Print'));
        fireEvent.click(screen.getByRole('button', { name: '20x30' }));
        fireEvent.click(screen.getByRole('button', { name: 'Add to cart' }));

        expect(mockAddItem).toHaveBeenCalledWith(mockPhoto, '20x30', 26);
        expect(screen.queryByRole('button', { name: 'Add to cart' })).not.toBeInTheDocument();
    });

    test('selects a size and calls updateSize when Change size is clicked', () => {
        render(<PrintSizeModal photo={mockPhoto} size="15x20" showAddToCartButton={false} />);

        fireEvent.click(screen.getByText('Print 15x20'));
        fireEvent.click(screen.getByRole('button', { name: 'A4' }));
        fireEvent.click(screen.getByRole('button', { name: 'Change size' }));

        expect(mockUpdateSize).toHaveBeenCalledWith(101, 'A4', 24);
        expect(screen.queryByRole('button', { name: 'Change size' })).not.toBeInTheDocument();
    });

    test('keeps current size if selected size toggle is clicked again (null newSize)', () => {
        render(<PrintSizeModal photo={mockPhoto} showAddToCartButton={true} />);

        fireEvent.click(screen.getByText('Print'));
        // 15x20 is selected by default; clicking it again passes null in exclusive mode
        fireEvent.click(screen.getByRole('button', { name: '15x20' }));
        fireEvent.click(screen.getByRole('button', { name: 'Add to cart' }));

        expect(mockAddItem).toHaveBeenCalledWith(mockPhoto, '15x20', 22);
    });
});
