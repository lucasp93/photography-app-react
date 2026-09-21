import React from 'react';
import { useNavigate } from 'react-router-dom';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { isLoggedIn, clearTokens } from '../services/auth';

export const UserDropdownComponent: React.FC = () => {
    const settings = ['Users', 'Albums', 'Photos', 'Orders', 'Login', 'Logout'];
    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => setAnchorElUser(event.currentTarget);

    const navigate = useNavigate();
    //const [ user, isAuthenticated ] = useAuth();

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
            case 'Logout':
                clearTokens();
                navigate('/');
                break;
            case 'Login':
                navigate('/login');
                break;
            default:
                break;
        }
    };

    return (
        <div>
            <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    {isLoggedIn() ?
                    <Avatar alt="User" src="/static/images/avatar/2.jpg" />
                    :
                    <AccountCircleIcon className="text-neutral-200" fontSize="large" />
                    }
                </IconButton>
            </Tooltip>
            <Menu sx={{ mt: '45px' }} anchorEl={anchorElUser} open={Boolean(anchorElUser)} onClose={handleCloseUserMenu} anchorOrigin={{ vertical: 'top', horizontal: 'right' }} transformOrigin={{ vertical: 'top', horizontal: 'right' }}>
                {isLoggedIn() ? settings.map((setting) => (
                    setting != 'Login' ?
                    <MenuItem key={setting} onClick={() => {
                        handleUserMenuClick(setting);
                    }}>
                        <Typography sx={{ textAlign: "center" }}>{setting}</Typography>
                    </MenuItem>
                    : null
                )):
                    <MenuItem key="login" onClick={() => {
                        handleUserMenuClick("Login");
                    }}>
                        <Typography sx={{ textAlign: "center" }}>Login</Typography>
                    </MenuItem>
                }
            </Menu>
        </div>
    )
}