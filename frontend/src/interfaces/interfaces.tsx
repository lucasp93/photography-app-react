// Database interfaces
export interface Photo {
    id: string | number;
    name: string;
    author: string;
    featured: boolean;
    is_favorited: boolean;
    url: string;
    album_id: string | number;
    album_name: string;
}

export interface Order {
    id: string | number;
    order_number: string;
    client_name: string;
    client_contact: string;
    client_email: string;
    price: number;
    photos: Photo[];
}

export interface Album {
    id: string | number;
    name: string;
    event: string;
    author: string;
}

export interface User {
    id: string | number;
    username: string;
    password: string
    email: string;
    first_name: string;
    last_name: string;
    last_login: string;
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