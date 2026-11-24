import type { Order } from '../interfaces/interfaces';
import { ApiUrls } from '../utils/ApiUrls';
import api from './api';

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

export async function getOrderById(orderId: string): Promise<Order[] | null> {
    const url = orderId
        ? ApiUrls.getOrderById.replace(':id', orderId)
        : ApiUrls.getOrders;
    try {
        return await api.apiGet<Order[]>(url);
    } catch (err) {
        console.error(`Failed to fetch order with id ${orderId}`, err);
        return null;
    }
}

export async function getOrders(): Promise<Order[] | null> {
    const url = ApiUrls.getOrders;
    try {
        return await api.apiGet<Order[]>(url);
    } catch (err) {
        console.error(`Failed to fetch orders`, err);
        return null;
    }
}

export async function updateUser(orderData: Order): Promise<boolean> {
    const url = orderData ? ApiUrls.updateUser : '';

    try {
        await api.apiPut(url, orderData);
        return true;
    } catch (err) {
        console.log('Error updating order:', err);
        return false;
    }
}

export async function deleteOrder(orderId: number | string): Promise<boolean> {
    const url = orderId ? ApiUrls.deleteOrder.replace(':id', orderId.toString()) : '';
    try {
        await api.apiDelete(url, Number(orderId));
        return true;
    } catch (err) {
        console.log('Error deleting order:', err);
        return false;
    }
}