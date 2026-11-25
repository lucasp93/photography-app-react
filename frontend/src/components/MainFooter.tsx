import React from 'react';
import { Stack, IconButton } from '@mui/material';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import type { AppFooterProps } from '../interfaces/interfaces';

export const MainFooter: React.FC<AppFooterProps> = ({ name }) => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="flex flex-col sm:flex-row items-center justify-between gap-2 py-4 px-4 sm:px-8 bg-white shadow-md">
            <Stack direction="row" spacing={2} sx={{ justifyContent: 'center' }}>
                <IconButton size="medium" color="inherit" href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><InstagramIcon /></IconButton>
                <IconButton size="medium" color="inherit" href="https://www.twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter"><TwitterIcon /></IconButton>
                <IconButton size="medium" color="inherit" href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><LinkedInIcon /></IconButton>
            </Stack>
            <div className="flex items-center space-x-4">
                <span className="font-semibold text-sm sm:text-base text-center">©{currentYear} {name} | All Rights Reserved</span>
            </div>
        </footer>
    )
}

export default MainFooter;