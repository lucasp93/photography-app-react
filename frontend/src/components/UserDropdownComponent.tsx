import React from 'react';
import { useNavigate } from 'react-router-dom';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
// import { isLoggedIn, clearTokens } from '../services/auth';
import { useAuth } from '../context/AuthContext';
import { DrawerContent } from './DrawerContent';


export const UserDropdownComponent: React.FC = () => {
    const adminSettings = ['Users', 'Albums', 'Photos', 'Orders', 'Login', 'Logout'];
    const userSettings = ['Favourites', 'Orders', 'Logout'];
    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => setAnchorElUser(event.currentTarget);

    const navigate = useNavigate();
    //const [ user, isAuthenticated ] = useAuth();
    const { logout, isAuthenticated, user } = useAuth();
    const handleCloseUserMenu = () => setAnchorElUser(null);


    const handleUserMenuClick = (setting: string) => {
        handleCloseUserMenu();
        console.log('menu setting: ', setting)
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
                logout();
                navigate('/');
                break;
            case 'Login':
                navigate('/login');
                break;
            case 'Favourites':
                navigate('/favourites');
                break;
            default:
                break;
        }
    };

    return (
        <div>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Tooltip title="Settings">
                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                        {isAuthenticated ?
                            <div className="flex items-center">
                                <Avatar alt="User" src="/static/images/avatar/2.jpg" sx={{ width: 30, height: 30 }} />
                                <p className="text-sm pl-2 pr-2 text-neutral-200">{user?.username}</p>
                            </div>
                            :
                            <AccountCircleIcon className="text-neutral-200" fontSize="medium" />
                        }
                    </IconButton>
                </Tooltip>
                <Tooltip title="Shopping bag">
                    <DrawerContent />
                </Tooltip>
            </Box>
            <Menu sx={{ mt: '45px' }} anchorEl={anchorElUser} open={Boolean(anchorElUser)} onClose={handleCloseUserMenu} anchorOrigin={{ vertical: 'top', horizontal: 'right' }} transformOrigin={{ vertical: 'top', horizontal: 'right' }}>
                {isAuthenticated && user?.role === "admin" ? adminSettings.map((setting) => (
                    setting != 'Login' ?
                        <MenuItem key={setting} onClick={() => {
                            handleUserMenuClick(setting);
                        }}>
                            <Typography sx={{ textAlign: "center" }}>{setting}</Typography>
                        </MenuItem>
                        : null
                )) : isAuthenticated && user?.role === "user" ? userSettings.map((setting) => (
                    setting != 'Login' ?
                        <MenuItem key={setting} onClick={() => {
                            handleUserMenuClick(setting);
                        }}>
                            <Typography sx={{ textAlign: "center" }}>{setting}</Typography>
                        </MenuItem>
                        : null
                )) :
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