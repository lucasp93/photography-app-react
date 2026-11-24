import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AlbumForm } from './AlbumForm';
import api from '../services/api';
import { ApiUrls } from '../utils/ApiUrls';

const mockNavigate = jest.fn();
let mockParams: { event?: string } = { event: 'weddings' };

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
    useParams: () => mockParams,
}));

jest.mock('../services/api', () => ({
    __esModule: true,
    default: {
        apiPost: jest.fn(),
        apiPut: jest.fn(),
    },
}));

const mockedApiPost = api.apiPost as jest.MockedFunction<typeof api.apiPost>;
const mockedApiPut = api.apiPut as jest.MockedFunction<typeof api.apiPut>;

describe('AlbumForm Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockParams = { event: 'weddings' };
        jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test('renders form with event from URL params pre-selected', () => {
        render(<AlbumForm action="create" />);

        expect(screen.getByText('Create weddings album')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Enter name')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Enter author')).toBeInTheDocument();
        expect(screen.getByRole('combobox')).toHaveValue('weddings');
        expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
    });

    test('submits create album payload and navigates to portfolio event page', async () => {
        mockedApiPost.mockResolvedValueOnce({ id: 1 });

        render(<AlbumForm action="create" />);

        fireEvent.change(screen.getByPlaceholderText('Enter name'), {
            target: { value: 'Summer Wedding' },
        });
        fireEvent.change(screen.getByRole('combobox'), {
            target: { value: 'weddings' },
        });
        fireEvent.change(screen.getByPlaceholderText('Enter author'), {
            target: { value: 'John Doe' },
        });

        fireEvent.submit(screen.getByRole('button', { name: 'Submit' }).closest('form')!);

        await waitFor(() => {
            expect(mockedApiPost).toHaveBeenCalledWith(ApiUrls.createAlbum, {
                name: 'Summer Wedding',
                event: 'weddings',
                author: 'John Doe',
            });
        });

        expect(mockNavigate).toHaveBeenCalledWith('/portfolio/weddings');
    });

    test('uses updateAlbum URL when action is not create', async () => {
        mockedApiPut.mockResolvedValueOnce({ id: 2 });

        render(<AlbumForm action="update" />);

        fireEvent.change(screen.getByPlaceholderText('Enter name'), {
            target: { value: 'Updated Album' },
        });
        fireEvent.change(screen.getByRole('combobox'), {
            target: { value: 'family' },
        });
        fireEvent.change(screen.getByPlaceholderText('Enter author'), {
            target: { value: 'Jane Doe' },
        });

        fireEvent.submit(screen.getByRole('button', { name: 'Submit' }).closest('form')!);

        await waitFor(() => {
            expect(mockedApiPut).toHaveBeenCalledWith(ApiUrls.updateAlbum, {
                name: 'Updated Album',
                event: 'family',
                author: 'Jane Doe',
            });
        });

        expect(mockNavigate).toHaveBeenCalledWith('/portfolio/family');
    });

    test('logs error and does not navigate when submission fails', async () => {
        mockedApiPost.mockRejectedValueOnce(new Error('Network error'));

        render(<AlbumForm action="create" />);

        fireEvent.change(screen.getByPlaceholderText('Enter name'), {
            target: { value: 'Broken Album' },
        });
        fireEvent.change(screen.getByPlaceholderText('Enter author'), {
            target: { value: 'John Doe' },
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
