import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { PhotoCard } from './PhotoCard';
import api from '../services/api';
import type { Photo } from '../interfaces/interfaces';

jest.mock('../services/api', () => ({
    __esModule: true,
    default: {
        apiPost: jest.fn(),
    },
}));

jest.mock('./PrintSizeModal', () => ({
    PrintSizeModal: ({ trigger }: { trigger?: React.ReactNode }) => (
        <div data-testid="print-size-modal">{trigger}</div>
    ),
}));

const mockedApiPost = api.apiPost as jest.MockedFunction<typeof api.apiPost>;

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

describe('PhotoCard Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test('renders photo details and hides album name by default', () => {
        render(<PhotoCard photo={mockPhoto} />);

        expect(screen.getByText('Sunset Shot')).toBeInTheDocument();
        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByRole('img')).toHaveAttribute('src', 'https://example.com/photo1.jpg');
        expect(screen.queryByText('Summer Wedding')).not.toBeInTheDocument();
    });

    test('renders album name when showAlbum is true', () => {
        render(<PhotoCard photo={mockPhoto} showAlbum={true} />);

        expect(screen.getByText('Summer Wedding')).toBeInTheDocument();
    });

    test('hides action buttons when showLinks is false', () => {
        render(<PhotoCard photo={mockPhoto} showLinks={false} />);

        expect(screen.queryByLabelText('Favourite')).not.toBeInTheDocument();
        expect(screen.queryByTestId('print-size-modal')).not.toBeInTheDocument();
    });

    test('toggles favorite status via API and calls onFavoriteChange', async () => {
        const mockOnFavoriteChange = jest.fn();
        mockedApiPost.mockResolvedValueOnce({ is_favorited: true });

        render(
            <PhotoCard
                photo={mockPhoto}
                isFavorited={false}
                onFavoriteChange={mockOnFavoriteChange}
            />
        );

        fireEvent.click(screen.getByLabelText('Favourite'));

        await waitFor(() => {
            expect(mockedApiPost).toHaveBeenCalledWith('/api/photos/101/favorite', {});
            expect(mockOnFavoriteChange).toHaveBeenCalledWith(101, true);
        });
    });

    test('reverts favorite status and notifies parent on API failure', async () => {
        const mockOnFavoriteChange = jest.fn();
        mockedApiPost.mockRejectedValueOnce(new Error('Network error'));

        render(
            <PhotoCard
                photo={mockPhoto}
                isFavorited={false}
                onFavoriteChange={mockOnFavoriteChange}
            />
        );

        fireEvent.click(screen.getByLabelText('Favourite'));

        await waitFor(() => {
            expect(mockOnFavoriteChange).toHaveBeenCalledWith(101, false);
        });
    });

    test('does not call API when photo is null', () => {
        render(<PhotoCard photo={null} />);

        fireEvent.click(screen.getByLabelText('Favourite'));
        expect(mockedApiPost).not.toHaveBeenCalled();
        expect(screen.queryByTestId('print-size-modal')).not.toBeInTheDocument();
    });
});
