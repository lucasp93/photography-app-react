import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { UserDropdownComponent } from './UserDropdownComponent';
import { useAuth } from '../context/AuthContext';

const mockNavigate = jest.fn();
const mockLogout = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}));

jest.mock('../context/AuthContext', () => ({
    useAuth: jest.fn(),
}));

jest.mock('./DrawerContent', () => ({
    DrawerContent: () => <div data-testid="drawer-content">Drawer</div>,
}));

const mockedUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

describe('UserDropdownComponent', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockedUseAuth.mockReturnValue({
            logout: mockLogout,
            isAuthenticated: false,
            user: null,
        } as unknown as ReturnType<typeof useAuth>);
    });

    test('shows Login menu item when unauthenticated and navigates on click', () => {
        render(<UserDropdownComponent />);

        expect(screen.getByTestId('drawer-content')).toBeInTheDocument();

        fireEvent.click(screen.getByLabelText('Settings'));
        const loginItem = screen.getByText('Login');
        expect(loginItem).toBeInTheDocument();

        fireEvent.click(loginItem);
        expect(mockNavigate).toHaveBeenCalledWith('/login');
    });

    test('shows admin menu options (excluding Login) when authenticated as admin', () => {
        mockedUseAuth.mockReturnValue({
            logout: mockLogout,
            isAuthenticated: true,
            user: { id: 1, username: 'adminuser', role: 'admin' },
        } as unknown as ReturnType<typeof useAuth>);

        render(<UserDropdownComponent />);
        expect(screen.getByText('adminuser')).toBeInTheDocument();

        fireEvent.click(screen.getByLabelText('Settings'));

        expect(screen.getByText('Users')).toBeInTheDocument();
        expect(screen.getByText('Albums')).toBeInTheDocument();
        expect(screen.getByText('Photos')).toBeInTheDocument();
        expect(screen.getByText('Orders')).toBeInTheDocument();
        expect(screen.getByText('Logout')).toBeInTheDocument();
        expect(screen.queryByText('Login')).not.toBeInTheDocument();
    });

    test('navigates to admin routes when admin menu items are clicked', () => {
        mockedUseAuth.mockReturnValue({
            logout: mockLogout,
            isAuthenticated: true,
            user: { id: 1, username: 'adminuser', role: 'admin' },
        } as unknown as ReturnType<typeof useAuth>);

        render(<UserDropdownComponent />);

        fireEvent.click(screen.getByLabelText('Settings'));
        fireEvent.click(screen.getByText('Orders'));
        expect(mockNavigate).toHaveBeenCalledWith('/orders');

        fireEvent.click(screen.getByLabelText('Settings'));
        fireEvent.click(screen.getByText('Albums'));
        expect(mockNavigate).toHaveBeenCalledWith('/albums');
    });

    test('shows Favourites and Logout for regular user and navigates on click', () => {
        mockedUseAuth.mockReturnValue({
            logout: mockLogout,
            isAuthenticated: true,
            user: { id: 2, username: 'regularuser', role: 'user' },
        } as unknown as ReturnType<typeof useAuth>);

        render(<UserDropdownComponent />);
        expect(screen.getByText('regularuser')).toBeInTheDocument();

        fireEvent.click(screen.getByLabelText('Settings'));

        expect(screen.getByText('Favourites')).toBeInTheDocument();
        expect(screen.getByText('Logout')).toBeInTheDocument();
        expect(screen.queryByText('Users')).not.toBeInTheDocument();

        fireEvent.click(screen.getByText('Favourites'));
        expect(mockNavigate).toHaveBeenCalledWith('/favourites');
    });

    test('calls logout and navigates home when Logout is clicked', () => {
        mockedUseAuth.mockReturnValue({
            logout: mockLogout,
            isAuthenticated: true,
            user: { id: 2, username: 'regularuser', role: 'user' },
        } as unknown as ReturnType<typeof useAuth>);

        render(<UserDropdownComponent />);

        fireEvent.click(screen.getByLabelText('Settings'));
        fireEvent.click(screen.getByText('Logout'));

        expect(mockLogout).toHaveBeenCalledTimes(1);
        expect(mockNavigate).toHaveBeenCalledWith('/');
    });
});
