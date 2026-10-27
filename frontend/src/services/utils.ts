import type { EmailProps, User, Album, Photo, Order } from '../interfaces/interfaces';
import { ApiUrls } from '../utils/ApiUrls';
import api from '../services/api';
import emailjs from '@emailjs/browser';

// EmailJS function
export async function sendEmail(formData: EmailProps): Promise<boolean> {
    try {
        const templateParams = {
            title: formData.subject,
            from_name: formData.name,
            reply_to: formData.email,
            message: formData.message,
        };
        // Send email to customer
        const clientResult = await emailjs.send(
            import.meta.env.VITE_EMAILJS_SERVICE_ID,
            import.meta.env.VITE_EMAILJS_CLIENT_TEMPLATE_ID,
            templateParams,
            import.meta.env.VITE_EMAILJS_PUBLIC_KEY
        );

        // Send eamil to admin
        const adminResult = await emailjs.send(
            import.meta.env.VITE_EMAILJS_SERVICE_ID,
            import.meta.env.VITE_EMAILJS_ADMIN_TEMPLATE_ID,
            templateParams,
            import.meta.env.VITE_EMAILJS_PUBLIC_KEY
        )

        return adminResult.status === 200 && clientResult.status === 200;
    } catch (err) {
        console.error('Failed to send email:', err);
        return false;
    }
}

// User functions
export async function createUser(userData: User): Promise<boolean> {
    const url = userData ? ApiUrls.createUser : '';

    try {
        await api.apiPost(url, userData);
        return true;
    } catch (err) {
        console.log('Error creating user:', err);
        return false;
    }
}

export async function updateUser(userData: User): Promise<boolean> {
    const url = userData ? ApiUrls.updateUser : '';

    try {
        await api.apiPut(url, userData);
        return true;
    } catch (err) {
        console.log('Error updating user:', err);
        return false;
    }
}

export async function updateUserPassword(): Promise<boolean> {
    return true;
}

// Album functions
export async function createAlbum(albumData: Album): Promise<boolean> {
    const url = albumData ? ApiUrls.createAlbum : '';

    try {
        await api.apiPost(url, albumData);
        return true;
    } catch (err) {
        console.log('Error creating album:', err);
        return false;
    }
}

export async function updateAlbum(albumData: Album): Promise<boolean> {
    const url = albumData ? ApiUrls.updateAlbum : '';

    try {
        await api.apiPut(url, albumData);
        return true;
    } catch (err) {
        console.log('Error updating album:', err);
        return false;
    }
}

// Photo functions
export async function createPhoto(photoData: Photo): Promise<boolean> {
    const url = photoData ? ApiUrls.createPhoto : '';
    try {
        await api.apiPost(url, photoData);
        return true;
    } catch (err) {
        console.log('Error creating photo:', err);
        return false;
    }
}

export async function updatePhoto(photoData: Photo): Promise<boolean> {
    const url = photoData ? ApiUrls.updatePhoto : '';

    try {
        await api.apiPut(url, photoData);
        return true;
    } catch (err) {
        console.log('Error updating photo:', err);
        return false;
    }
}

export async function getUserFavoritePhotos(user_id: number): Promise<Photo[] | null> {
    const url = ApiUrls.getFavoritePhotos;
    try {
        return api.apiGet<(Photo[])>(url);
    } catch (err) {
        console.log('Error getting favorite photos: ', err);
        return [];
    }
}

// General functions
export async function deleteItem(url: string, id: number): Promise<boolean> {
    //const url = ApiUrls.deleteUser.replace(':id', id);
    try {
        await api.apiDelete(url, id);
        return true;
    } catch (err) {
        console.log('Error deleting user:', err);
        return false;
    }
}

export async function getUserByEmail(email: string): Promise<User[] | null> {
    const url = email
        ? ApiUrls.getUserByEmail.replace(':email', email)
        : ApiUrls.getUserByEmail;
    try {
        return await api.apiGet<User[]>(url);
    } catch (err) {
        console.error(`Failed to fetch user with email ${email}`, err);
        return null;
    }
}

export async function getUserById(userId: string): Promise<User[] | null> {
    const url = userId
        ? ApiUrls.getUser.replace(':id', userId)
        : ApiUrls.getUser;
    try {
        return await api.apiGet<User[]>(url);
    } catch (err) {
        console.error(`Failed to fetch user with id ${userId}`, err);
        return null;
    } getUserByEmail
}

export async function getAlbumById(album_id: string): Promise<Album[] | null> {
    const url = album_id
        ? ApiUrls.getAlbum.replace(':id', album_id)
        : ApiUrls.getAlbum;
    try {
        return await api.apiGet<Album[]>(url);
    } catch (err) {
        console.error(`Failed to fetch album with id ${album_id}`, err);
        return null;
    }
}

// Order functions
export async function createOrder(orderData: Order): Promise<boolean> {
    const url = orderData ? ApiUrls.createOrder : '';

    try {
        await api.apiPost(url, orderData);
        return true;
    } catch (err) {
        console.log('Error creating order:', err);
        return false;
    }
}

// Time functions
export const formatDate = (isoString: string): string => {
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}