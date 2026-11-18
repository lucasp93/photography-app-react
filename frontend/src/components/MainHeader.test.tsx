import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MainHeader } from './MainHeader';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}));

jest.mock('./UserDropdownComponent', () => ({
    UserDropdownComponent: () => <div data-testid="user-dropdown">UserDropdown</div>,
}));

describe('MainHeader Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders navigation buttons and user dropdown', () => {
        render(<MainHeader />);

        expect(screen.getByTitle('Home')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Portfolio' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Info' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Contact' })).toBeInTheDocument();
        expect(screen.getByTestId('user-dropdown')).toBeInTheDocument();
    });

    test('navigates home when camera icon button is clicked', () => {
        render(<MainHeader />);

        fireEvent.click(screen.getByTitle('Home'));
        expect(mockNavigate).toHaveBeenCalledWith('/');
    });

    test('navigates to /contact when Contact button is clicked', () => {
        render(<MainHeader />);

        fireEvent.click(screen.getByRole('button', { name: 'Contact' }));
        expect(mockNavigate).toHaveBeenCalledWith('/contact');
    });

    test('opens Portfolio submenu on mouseEnter and navigates when item is clicked', () => {
        render(<MainHeader />);

        fireEvent.mouseEnter(screen.getByRole('button', { name: 'Portfolio' }));
        const weddingsItem = screen.getByText('Weddings');
        expect(weddingsItem).toBeInTheDocument();

        fireEvent.click(weddingsItem);
        expect(mockNavigate).toHaveBeenCalledWith('/portfolio/weddings');
    });

    test('opens Info submenu on mouseEnter and navigates when item is clicked', () => {
        render(<MainHeader />);

        fireEvent.mouseEnter(screen.getByRole('button', { name: 'Info' }));
        const experienceItem = screen.getByText('Experience');
        expect(experienceItem).toBeInTheDocument();

        fireEvent.click(experienceItem);
        expect(mockNavigate).toHaveBeenCalledWith('/info/experience');
    });
});
