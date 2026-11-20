import React from 'react';
import { useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import CameraIcon from '@mui/icons-material/Camera';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { UserDropdownComponent } from './UserDropdownComponent';

// 1. FIXED DATA STRUCTURE: Items are now objects with labels and paths
const pages = [
    {
        label: 'Portfolio',
        path: '/portfolio',
        items: [
            { label: 'Weddings', path: '/portfolio/weddings' },
            { label: 'Birthday', path: '/portfolio/birthday' },
            { label: 'Family', path: '/portfolio/family' },
            { label: 'Business', path: '/portfolio/business' },
            { label: 'Maternity', path: '/portfolio/maternity' },
            { label: 'Newborn', path: '/portfolio/newborn' },
        ]
    },
    {
        label: 'Info',
        path: '/info',
        items: [
            { label: 'Experience', path: '/info/experience' },
            { label: 'Testimonials', path: '/info/testimonials' }
        ]
    },
    { label: 'Contact', path: '/contact' }
];

const settings = ['Users', 'Albums', 'Photos', 'Logout'];

export const NavMenu: React.FC<{ page: typeof pages[0] }> = ({ page }) => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const navigate = useNavigate(); // Hook enabled

    const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
        if (page.items) setAnchorEl(event.currentTarget);
    };

    const handleClose = () => setAnchorEl(null);

    const handleNavigate = (targetPath: string) => {
        handleClose();
        navigate(targetPath); // Perfom programmatic navigation
    };

    return (
        <Box sx={{ display: 'inline-block' }}>
            <Button
                onMouseEnter={handleOpen}
                onClick={(event) => {
                    if (page.items) {
                        handleOpen(event);
                    } else {
                        handleNavigate(page.path);
                    }
                }}
                endIcon={page.items ? <KeyboardArrowDownIcon /> : null}
                sx={{ my: 2, color: 'white', display: 'flex', textTransform: 'none' }}
            >
                {page.label}
            </Button>
            {page.items && (
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                    transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                >
                    {page.items.map((item) => (
                        <MenuItem
                            key={item.label}
                            onClick={() => handleNavigate(item.path)}
                        >
                            <Typography sx={{ textAlign: 'center' }}>{item.label}</Typography>
                        </MenuItem>
                    ))}
                </Menu>
            )}
        </Box>
    );
};

export const MainHeader: React.FC = () => {
    const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
    const navigate = useNavigate(); // Hook enabled

    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => setAnchorElNav(event.currentTarget);
    const handleCloseNavMenu = () => setAnchorElNav(null);
    const handleCloseUserMenu = () => setAnchorElUser(null);

    const handleUserMenuClick = (setting: string) => {
        handleCloseUserMenu();
        switch (setting) {
            case 'Users':
                navigate('/users');
                break;
            case 'Albums':
                navigate('/albums');
                break;
            case 'Photos':
                navigate('/photos');
                break;
            case 'Orders':
                navigate('/orders');
                break;
            case 'Logout':
                navigate('/login');
                break;
            default:
                break;
        }
    };

    return (
        <AppBar position="static">
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <IconButton size="medium" onClick={() => navigate('/')} color="inherit" title="Home">
                        <CameraIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
                    </IconButton>
                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                        <IconButton size="large" onClick={handleOpenNavMenu} color="inherit"><MenuIcon /></IconButton>
                        <Menu anchorEl={anchorElNav} open={Boolean(anchorElNav)} onClose={handleCloseNavMenu} sx={{ display: { xs: 'block', md: 'none' } }}>
                            {pages.map((page) =>
                                page.items ? (
                                    [
                                        <MenuItem key={page.label} disabled>
                                            <Typography sx={{ fontWeight: 'bold' }}>{page.label}</Typography>
                                        </MenuItem>,
                                        ...page.items.map((item) => (
                                            <MenuItem
                                                key={item.label}
                                                sx={{ pl: 4 }}
                                                onClick={() => {
                                                    handleCloseNavMenu();
                                                    navigate(item.path);
                                                }}
                                            >
                                                <Typography>{item.label}</Typography>
                                            </MenuItem>
                                        )),
                                    ]
                                ) : (
                                    <MenuItem
                                        key={page.label}
                                        onClick={() => {
                                            handleCloseNavMenu();
                                            navigate(page.path);
                                        }}
                                    >
                                        <Typography>{page.label}</Typography>
                                    </MenuItem>
                                )
                            )}
                        </Menu>
                    </Box>

                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                        {pages.map((page) => (
                            <NavMenu key={page.label} page={page} />
                        ))}
                    </Box>

                    <Box sx={{ flexGrow: 0 }}>
                        <UserDropdownComponent />
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}

export default MainHeader;