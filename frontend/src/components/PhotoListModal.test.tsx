import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { PhotoListModal } from './PhotoListModal';
import type { Photo } from '../interfaces/interfaces';

const mockPhotos: Photo[] = [
    {
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
    },
    {
        id: 102,
        name: 'Beach Walk',
        author: 'Jane Doe',
        featured: false,
        is_favorited: false,
        album: null,
        url: 'https://example.com/photo2.jpg',
        album_id: 2,
        album_name: 'Family Trip',
        album_author: 'Jane Doe',
        size: '20x30',
    },
];

describe('PhotoListModal Component', () => {
    beforeEach(() => {
        jest.spyOn(console, 'log').mockImplementation(() => {});
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test('renders default trigger button and opens modal showing plural title and photos', () => {
        render(<PhotoListModal photos={mockPhotos} />);

        fireEvent.click(screen.getByRole('button'));

        expect(screen.getByText('Photos')).toBeInTheDocument();
        expect(screen.getByText('Sunset Shot')).toBeInTheDocument();
        expect(screen.getByText('Summer Wedding')).toBeInTheDocument();
        expect(screen.getByText('Beach Walk')).toBeInTheDocument();
        expect(screen.getByText('Family Trip')).toBeInTheDocument();
    });

    test('renders singular title when only one photo is provided', () => {
        render(
            <PhotoListModal
                photos={[mockPhotos[0]]}
                trigger={<button type="button">View Photo</button>}
            />
        );

        fireEvent.click(screen.getByRole('button', { name: 'View Photo' }));

        expect(screen.getByText('Photo')).toBeInTheDocument();
        expect(screen.getByText('Sunset Shot')).toBeInTheDocument();
    });

    test('renders empty message when photos array is empty', () => {
        render(<PhotoListModal photos={[]} />);

        fireEvent.click(screen.getByRole('button'));

        expect(screen.getByText('Photo')).toBeInTheDocument();
        expect(screen.getByText('No photos in order.')).toBeInTheDocument();
    });
});
