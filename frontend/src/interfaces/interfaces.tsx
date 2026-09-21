// Database interfaces
export interface Photo {
    id: string | number;
    name: string;
    author: string;
    featured: boolean;
    url: string;
}

export interface Album {
    id: string | number;
    name: string;
    event: string;
    author: string;
}

export interface User {
    username: string;
    password: string
    email: string;
    first_name: string;
    last_name: string;
    role: string;
}

//others
export interface AppFooterProps {
    name: string;
    year: number;
}

export interface EmailProps {
    name: string;
    subject: string;
    email: string;
    message: string;
}