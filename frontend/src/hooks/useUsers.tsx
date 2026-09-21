import { useState, useEffect } from 'react';
import { ApiUrls } from '../utils/ApiUrls';

export interface User {
    id?: string | number;
    username: string | null;
    email: string | null;
    firstName: string | null;
    lastName: string | null;
    isActive: boolean | null;
    role: string | null;
    createdAt: string | null;
}

export const useUsers = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const url = ApiUrls.getUsers;
        fetch(url)
            .then((res)=> res.json())
            .then((data) => {
                setUsers(data)
                setLoading(false);
            });
    }, []);

    return { users, loading};
}

export default useUsers;