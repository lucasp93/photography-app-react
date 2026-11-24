import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { PhotoForm } from './PhotoForm';
import api from '../services/api';
import { ApiUrls } from '../utils/ApiUrls';
import type { Album } from '../interfaces/interfaces';

const mockNavigate = jest.fn();
let mockParams: { album_id?: string } = { album_id: '5' };

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
    useParams: () => mockParams,
}));

jest.mock('../services/api', () => ({
    __esModule: true,
    default: {
        apiGet: jest.fn(),
        apiPost: jest.fn(),
        apiPut: jest.fn(),
    },
}));

const mockedApiGet = api.apiGet as jest.MockedFunction<typeof api.apiGet>;
const mockedApiPost = api.apiPost as jest.MockedFunction<typeof api.apiPost>;
const mockedApiPut = api.apiPut as jest.MockedFunction<typeof api.apiPut>;

const mockAlbum: Album = {
    id: 5,
    name: 'Autumn Portraits',
    event: 'family',
    author: 'Jane Doe',
};

describe('PhotoForm Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockParams = { album_id: '5' };
        jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test('fetches album data on mount and populates disabled album input', async () => {
        mockedApiGet.mockResolvedValueOnce(mockAlbum);

        render(<PhotoForm action="create" />);

        const albumInput = screen.getByPlaceholderText('Enter album');
        expect(albumInput).toBeDisabled();

        await waitFor(() => {
            expect(mockedApiGet).toHaveBeenCalledWith(ApiUrls.getAlbum.replace(':id', '5'));
            expect(albumInput).toHaveValue('Autumn Portraits');
        });
    });

    test('renders form fields and submit button even when album fetch fails', async () => {
        mockedApiGet.mockRejectedValueOnce(new Error('Not found'));

        render(<PhotoForm action="create" />);

        await waitFor(() => {
            expect(mockedApiGet).toHaveBeenCalledWith(ApiUrls.getAlbum.replace(':id', '5'));
        });

        expect(screen.getByText('Add photo')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Enter album')).toHaveValue('');
        expect(screen.getByPlaceholderText('Enter name')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Enter author')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Enter url')).toBeInTheDocument();
        expect(screen.getByRole('checkbox')).not.toBeChecked();
        expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
    });

    test('submits create form payload with featured false and navigates to album page', async () => {
        mockedApiGet.mockResolvedValueOnce(mockAlbum);
        mockedApiPost.mockResolvedValueOnce({ id: 10 });

        render(<PhotoForm action="create" />);

        await waitFor(() => {
            expect(screen.getByPlaceholderText('Enter album')).toHaveValue('Autumn Portraits');
        });

        fireEvent.change(screen.getByPlaceholderText('Enter name'), {
            target: { value: 'Golden Hour' },
        });
        fireEvent.change(screen.getByPlaceholderText('Enter author'), {
            target: { value: 'Jane Doe' },
        });
        fireEvent.change(screen.getByPlaceholderText('Enter url'), {
            target: { value: 'https://example.com/golden-hour.jpg' },
        });

        fireEvent.submit(screen.getByRole('button', { name: 'Submit' }).closest('form')!);

        await waitFor(() => {
            expect(mockedApiPost).toHaveBeenCalledWith(ApiUrls.createPhoto, {
                name: 'Golden Hour',
                url: 'https://example.com/golden-hour.jpg',
                author: 'Jane Doe',
                album: '5',
                featured: false,
            });
        });

        expect(mockNavigate).toHaveBeenCalledWith('/albums/5');
    });

    test('submits featured as true when checkbox is checked', async () => {
        mockedApiGet.mockResolvedValueOnce(mockAlbum);
        mockedApiPost.mockResolvedValueOnce({ id: 11 });

        render(<PhotoForm action="create" />);

        await waitFor(() => {
            expect(screen.getByPlaceholderText('Enter album')).toHaveValue('Autumn Portraits');
        });

        fireEvent.change(screen.getByPlaceholderText('Enter name'), {
            target: { value: 'Featured Shot' },
        });
        fireEvent.change(screen.getByPlaceholderText('Enter author'), {
            target: { value: 'Jane Doe' },
        });
        fireEvent.change(screen.getByPlaceholderText('Enter url'), {
            target: { value: 'https://example.com/featured.jpg' },
        });
        fireEvent.click(screen.getByRole('checkbox'));

        fireEvent.submit(screen.getByRole('button', { name: 'Submit' }).closest('form')!);

        await waitFor(() => {
            expect(mockedApiPost).toHaveBeenCalledWith(ApiUrls.createPhoto, {
                name: 'Featured Shot',
                url: 'https://example.com/featured.jpg',
                author: 'Jane Doe',
                album: '5',
                featured: true,
            });
        });

        expect(mockNavigate).toHaveBeenCalledWith('/albums/5');
    });

    test('uses updatePhoto URL when action is not create', async () => {
        mockedApiGet.mockResolvedValueOnce(mockAlbum);
        mockedApiPut.mockResolvedValueOnce({ id: 12 });

        render(<PhotoForm action="update" />);

        await waitFor(() => {
            expect(screen.getByPlaceholderText('Enter album')).toHaveValue('Autumn Portraits');
        });

        fireEvent.change(screen.getByPlaceholderText('Enter name'), {
            target: { value: 'Updated Shot' },
        });
        fireEvent.change(screen.getByPlaceholderText('Enter author'), {
            target: { value: 'Jane Doe' },
        });
        fireEvent.change(screen.getByPlaceholderText('Enter url'), {
            target: { value: 'https://example.com/updated.jpg' },
        });

        fireEvent.submit(screen.getByRole('button', { name: 'Submit' }).closest('form')!);

        await waitFor(() => {
            expect(mockedApiPut).toHaveBeenCalledWith(ApiUrls.updatePhoto, {
                name: 'Updated Shot',
                url: 'https://example.com/updated.jpg',
                author: 'Jane Doe',
                album: '5',
                featured: false,
            });
        });

        expect(mockNavigate).toHaveBeenCalledWith('/albums/5');
    });

    test('does not navigate when photo submission fails', async () => {
        mockedApiGet.mockResolvedValueOnce(mockAlbum);
        mockedApiPost.mockRejectedValueOnce(new Error('Server error'));

        render(<PhotoForm action="create" />);

        await waitFor(() => {
            expect(screen.getByPlaceholderText('Enter album')).toHaveValue('Autumn Portraits');
        });

        fireEvent.change(screen.getByPlaceholderText('Enter name'), {
            target: { value: 'Broken Shot' },
        });
        fireEvent.change(screen.getByPlaceholderText('Enter author'), {
            target: { value: 'Jane Doe' },
        });
        fireEvent.change(screen.getByPlaceholderText('Enter url'), {
            target: { value: 'https://example.com/broken.jpg' },
        });

        fireEvent.submit(screen.getByRole('button', { name: 'Submit' }).closest('form')!);

        await waitFor(() => {
            expect(mockedApiPost).toHaveBeenCalled();
            expect(console.error).toHaveBeenCalledWith(
                'Error creating album:',
                expect.any(Error)
            );
        });

        expect(mockNavigate).not.toHaveBeenCalled();
    });
});
