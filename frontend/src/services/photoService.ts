import type { Photo } from '../interfaces/interfaces';
import { ApiUrls } from '../utils/ApiUrls';
import api from './api';

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

export async function deletePhoto(photoId: number | string): Promise<boolean> {
    const url = ApiUrls.deletePhoto.replace(':id', photoId.toString());
    try {
        await api.apiDelete(url, Number(photoId));
        return true;
    } catch (err) {
        console.log('Error deleting photo:', err);
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

export async function getPhotos(): Promise<Photo[] | null> {
    const url = ApiUrls.getPhotos;
    try {
        return api.apiGet<(Photo[])>(url);
    } catch (err) {
        console.log('Error getting photos: ', err);
        return [];
    }
}

export async function getUserFavoritePhotos(): Promise<Photo[] | null> {
    const url = ApiUrls.getFavoritePhotos;
    try {
        return api.apiGet<(Photo[])>(url);
    } catch (err) {
        console.log('Error getting favorite photos: ', err);
        return [];
    }
}