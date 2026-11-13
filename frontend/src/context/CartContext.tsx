import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Photo } from '../interfaces/interfaces';

export interface CartItem {
    photo: Photo;
    size: string;
    quantity: number;
    price: number;
}

interface CartContextValue {
    items: CartItem[];
    addItem: (photo: Photo, size: string, price: number) => void;
    removeItem: (photoId: string | number, size: string) => void;
    updateQuantity: (photoId: string | number, size: string, quantity: number) => void;
    updateSize: (photoId: string | number, size: string, price: number) => void;
    itemCount: number;
    totalPrice: number;
    clearCart: () => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);
const storageKey = 'photography-app-cart';

export const CartProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const [items, setItems] = useState<CartItem[]>(() => {
        const storedItems = localStorage.getItem(storageKey);
        if (!storedItems) return [];

        try {
            return JSON.parse(storedItems) as CartItem[];
        } catch {
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem(storageKey, JSON.stringify(items));
    }, [items]);

    const addItem = (photo: Photo, size: string, price: number) => {
        setItems((currentItems) => {
            const existingItem = currentItems.find(
                (item) => item.photo.id === photo.id && item.size === size,
            );

            if (existingItem) {
                return currentItems.map((item) =>
                    item.photo.id === photo.id && item.size === size
                        ? { ...item, quantity: item.quantity + 1 }
                        : item,
                );
            }

            return [...currentItems, { photo, size, quantity: 1, price: price }]; // Assuming a fixed price of $20 for each photo
        });
    };

    const removeItem = (photoId: string | number, size: string) => {
        setItems((currentItems) =>
            currentItems.filter(
                (item) => String(item.photo.id) !== String(photoId) || item.size !== size,
            ),
        );
    };

    const updateQuantity = (photoId: string | number, size: string, quantity: number) => {
        if (quantity < 1) {
            removeItem(photoId, size);
            return;
        }

        setItems((currentItems) =>
            currentItems.map((item) =>
                item.photo.id === photoId && item.size === size
                    ? { ...item, quantity }
                    : item,
            ),
        );
    };

    const updateSize = (photoId: string | number, size: string, price: number) => {
        setItems((currentItems) => 
            currentItems.map((item) =>
                item.photo.id === photoId
                    ? { ...item, size, price }
                    : item,
            ),
        );
    };

    const clearCart = () => {
        setItems([]);
        localStorage.removeItem(storageKey);
    };

    const itemCount = items.reduce((total, item) => total + item.quantity, 0);
    const totalPrice = items.reduce((total, item) => total + item.price * item.quantity, 0);

    return (
        <CartContext.Provider value={{
            items, 
            addItem, 
            removeItem, 
            updateQuantity,
            updateSize,
            clearCart, 
            itemCount,
            totalPrice
        }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = (): CartContextValue => {
    const context = useContext(CartContext);
    if (!context) throw new Error('useCart must be used inside CartProvider');
    return context;
};
