import React from 'react';
import { Stack, IconButton } from '@mui/material';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import type { AppFooterProps } from '../interfaces/interfaces';

export const MainFooter: React.FC<AppFooterProps> = ({ name, year }) => {
    return (
        <footer className="flex items-center justify-between align-middle py-4 px-8 bg-white shadow-md">
            <Stack direction="row" spacing={2} sx={{ mb: 1, justifyContent: 'center' }}>
                <IconButton size="medium" color="inherit" href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><InstagramIcon /></IconButton>
                <IconButton size="medium"color="inherit" href="https://www.twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter"><TwitterIcon /></IconButton>
                <IconButton size="medium" color="inherit" href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><LinkedInIcon /></IconButton>
            </Stack>
            <div className="flex items-center align-middle space-x-4 mb-2">
                {/* <img src="/logo.png" alt="Logo" className="h-10" /> */}
                <span className="font-semibold text-base">©{year} {name} | All Rights Reserved</span>
            </div>
        </footer>
    )
}

export default MainFooter;