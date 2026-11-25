// Database interfaces
export interface Album {
    id: string | number;
    name: string;
    event: string;
    author: string;
}

export interface PhotoSummary {
    id: string | number;
    name: string;
    author: string;
    url: string;
    size?: string;
    album_name?: string;
    album_author?: string;
}

export interface PhotoCreateInput {
    name: string;
    author: string;
    featured: boolean;
    url: string;
    album_id: string | number;
    size?: string;
}
export interface PhotoFormPayload {
    name: string;
    url: string;
    author: string;
    album: string | undefined;
    featured: boolean;
}

export interface Photo extends PhotoSummary {
    featured: boolean;
    is_favorited?: boolean;
    album?: Album | null;
    album_id?: string | number;
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

export interface UserProfile {
    id: string | number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    role: string;
    last_login?: string;
}

export interface UserCreateInput extends Omit<UserProfile, 'id' | 'last_login'> {
    id?: string | number;
    password: string;
    last_login?: string;
}

export interface User extends UserProfile {
    password?: string;
}

// Others
export interface AppFooterProps {
    name: string;
}

export interface EmailProps {
    name: string;
    subject: string;
    email: string;
    message: string;
}
