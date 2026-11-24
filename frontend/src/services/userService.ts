import type { User } from '../interfaces/interfaces';
import { ApiUrls } from '../utils/ApiUrls';
import api from './api';

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

export async function deleteUser(userId: string | number): Promise<boolean> {
    const url = userId ? ApiUrls.deleteUser ? ApiUrls.deleteUser.replace(':id', userId.toString()) : '' : '';
    try {
        await api.apiDelete(url, Number(userId));
        return true;
    } catch (err) {
        console.log('Error deleting user:', err);
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

export async function getUsers(): Promise<User[] | null> {
    const url = ApiUrls.getUsers;
    try {
        return await api.apiGet<User[]>(url);
    } catch (err) {
        console.error(`Failed to fetch users`, err);
        return null;
    }
}

export async function updateUserPassword(): Promise<boolean> {
    return true;
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
    }
}
