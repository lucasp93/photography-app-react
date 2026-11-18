import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AlbumCard } from './AlbumCard';
import api from '../services/api';
import { ApiUrls } from '../utils/ApiUrls';
import type { Album, Photo } from '../interfaces/interfaces';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}));

jest.mock('../services/api', () => ({
    __esModule: true,
    default: {
        apiGet: jest.fn(),
    },
}));

const mockedApiGet = api.apiGet as jest.MockedFunction<typeof api.apiGet>;

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

describe('AlbumCard Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.spyOn(console, 'error').mockImplementation(() => { });
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test('renders loading state initially', () => {
        mockedApiGet.mockReturnValue(new Promise(() => { })); // keep pending
        render(<AlbumCard album={mockAlbum} />);

        expect(screen.getByText('Loading items...')).toBeInTheDocument();
    });

    test('fetches featured photos for the album and renders album details', async () => {
        mockedApiGet.mockResolvedValueOnce(mockFeaturedPhotos);

        render(<AlbumCard album={mockAlbum} />);

        await waitFor(() => {
            expect(screen.getByText('Summer Wedding')).toBeInTheDocument();
        });

        expect(mockedApiGet).toHaveBeenCalledWith(
            `${ApiUrls.getPhotos}?album_id=${mockAlbum.id}&featured=true`
        );
        expect(screen.getByText('John Doe')).toBeInTheDocument();

        const img = screen.getByRole('img');
        expect(img).toHaveAttribute('src', 'https://example.com/photo1.jpg');
    });

    test('uses fallback image when no featured photos are returned', async () => {
        mockedApiGet.mockResolvedValueOnce([]);

        render(<AlbumCard album={mockAlbum} />);

        await waitFor(() => {
            expect(screen.getByText('Summer Wedding')).toBeInTheDocument();
        });

        const img = screen.getByRole('img');
        expect(img).toHaveAttribute('src', 'https://picsum.photos/id/237/1200/800.jpg');
    });

    test('fetches default getPhotos URL when album is null', async () => {
        mockedApiGet.mockResolvedValueOnce([]);

        render(<AlbumCard album={null} />);

        await waitFor(() => {
            expect(mockedApiGet).toHaveBeenCalledWith(ApiUrls.getPhotos);
        });
    });

    test('renders Favourite and Cart buttons when showLinks is true (default)', async () => {
        mockedApiGet.mockResolvedValueOnce(mockFeaturedPhotos);

        render(<AlbumCard album={mockAlbum} />);

        await waitFor(() => {
            expect(screen.getByLabelText('Favourite')).toBeInTheDocument();
        });
        expect(screen.getByLabelText('Cart')).toBeInTheDocument();
    });

    test('hides Favourite and Cart buttons when showLinks is false', async () => {
        mockedApiGet.mockResolvedValueOnce(mockFeaturedPhotos);

        render(<AlbumCard album={mockAlbum} showLinks={false} />);

        await waitFor(() => {
            expect(screen.getByText('Summer Wedding')).toBeInTheDocument();
        });

        expect(screen.queryByLabelText('Favourite')).not.toBeInTheDocument();
        expect(screen.queryByLabelText('Cart')).not.toBeInTheDocument();
    });

    test('navigates to album detail page when card is clicked', async () => {
        mockedApiGet.mockResolvedValueOnce(mockFeaturedPhotos);

        render(<AlbumCard album={mockAlbum} />);

        await waitFor(() => {
            expect(screen.getByText('Summer Wedding')).toBeInTheDocument();
        });

        fireEvent.click(screen.getByText('Summer Wedding'));
        expect(mockNavigate).toHaveBeenCalledWith(`/albums/${mockAlbum.id}/`);
    });

    test('renders error message when API fails with an Error instance', async () => {
        mockedApiGet.mockRejectedValueOnce(new Error('Failed to load photos'));

        render(<AlbumCard album={mockAlbum} />);

        await waitFor(() => {
            expect(screen.getByText('Error: Failed to load photos')).toBeInTheDocument();
        });
    });

    test('renders fallback error message when API fails with a non-Error value', async () => {
        mockedApiGet.mockRejectedValueOnce('Server failure');

        render(<AlbumCard album={mockAlbum} />);

        await waitFor(() => {
            expect(screen.getByText('Error: An unknown error occurred')).toBeInTheDocument();
        });
    });
});