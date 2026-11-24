import api from '../services/api';

export async function deleteItem(url: string, id: number): Promise<boolean> {
    try {
        await api.apiDelete(url, id);
        return true;
    } catch (err) {
        console.log('Error deleting user:', err);
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