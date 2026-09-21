import { useState, useEffect } from 'react';
import { ApiUrls } from '../utils/ApiUrls';

export interface Order {
    id?: string | number;
    orderNumber: string | null;
    clientName: string | null;
    clientEmail: string | null;
    clientContact: string | null;
    price: number | null;
    createdAt: string | null;
}

export const useOrders = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const url = ApiUrls.getOrders;
        fetch(url)
            .then((res)=> res.json())
            .then((data) => {
                setOrders(data)
                setLoading(false);
            });
    }, []);

    return { orders, loading};
}

export default useOrders;