import type { Album } from '../interfaces/interfaces';
import { ApiUrls } from '../utils/ApiUrls';
import api from './api';

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

export async function deleteAlbum(albumId: string | number): Promise<boolean> {
    const url = albumId ? ApiUrls.deleteAlbum : '';
    try {
        await api.apiDelete(url, Number(albumId));
        return true;
    } catch (err) {
        console.log('Error deleting album:', err);
        return false;
    }
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

export async function getAlbums(): Promise<Album[] | null> {
    const url = ApiUrls.getAlbums;
    try {
        return await api.apiGet<Album[]>(url);
    } catch (err) {
        console.error(`Failed to fetch albums`, err);
        return null;
    }
}