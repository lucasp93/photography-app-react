import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User } from '../interfaces/interfaces';
import auth from '../services/auth';

type AuthContextValue = {
    user: User | null;
    isAuthenticated: boolean;
    loading: boolean;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);
const IDLE_TIMEOUT_MS = 15 * 60 * 1000;

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        let isActive = true;

        async function loadUser() {
            if (!auth.isLoggedIn()) {
                if (isActive) setLoading(false);
                return;
            }

            try {
                const response = await fetch('/api/users/me/', {
                    headers: {
                        Authorization: `Bearer ${auth.getAccessToken()}`,
                        ContentType: 'application/json',
                    },
                });

                if (!response.ok) {
                    auth.clearTokens();
                    if (isActive) setUser(null);
                    return;
                }
                const currentUser = await response.json();
                if (isActive) setUser(currentUser);
            } catch {
                auth.clearTokens();
                if (isActive) setUser(null);
            } finally {
                if (isActive) setLoading(false);
            }
        }
        loadUser();

        const handleStorageChange = (event: StorageEvent) => {
            if (event.key === 'auth.access' || event.key === null) {
                setUser(null);
                setLoading(false);
            }
        };
        window.addEventListener('storage', handleStorageChange);

        return () => {
            isActive = false;
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    useEffect(() => {
        if (loading || !user) return;

        const expireSession = () => {
            auth.clearTokens();
            setUser(null);
        };

        let timeoutId = window.setTimeout(expireSession, IDLE_TIMEOUT_MS);
        const resetIdleTimeout = () => {
            window.clearTimeout(timeoutId);
            timeoutId = window.setTimeout(expireSession, IDLE_TIMEOUT_MS);
        };
        const activityEvents: (keyof WindowEventMap)[] = [
            'pointerdown',
            'mousemove',
            'keydown',
            'scroll',
            'touchstart',
            'wheel',
        ];

        activityEvents.forEach((eventName) => {
            window.addEventListener(eventName, resetIdleTimeout, { passive: true });
        });

        return () => {
            window.clearTimeout(timeoutId);
            activityEvents.forEach((eventName) => {
                window.removeEventListener(eventName, resetIdleTimeout);
            });
        };
    }, [loading, user]);

    async function login(username: string, password: string) {
        await auth.login(username, password);

        const response = await fetch('/api/users/me/', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${auth.getAccessToken()}`,
            }
        });

        if (!response.ok) {
            auth.clearTokens();
            setUser(null);
            throw new Error('Could not load user');
        }

        setUser(await response.json());
    }

    function logout() {
        auth.clearTokens();
        setUser(null);
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: user !== null,
                loading,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuth must be used inside AuthProvider');
    }

    return context;
}

