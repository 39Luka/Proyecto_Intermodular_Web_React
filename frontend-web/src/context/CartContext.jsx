/**
 * @fileoverview Contexto global del carrito de la compra.
 *
 * Expone `CartProvider` y el hook `useCart`. El estado del carrito se persiste
 * automáticamente en `localStorage` con la clave `"bakery_cart"` para sobrevivir
 * recargas de página.
 *
 * Operaciones disponibles a través del contexto:
 * - `addToCart(product, quantity)` — Añade o incrementa un producto (respeta el stock).
 * - `removeFromCart(productId)` — Elimina completamente un producto.
 * - `updateQuantity(productId, quantity)` — Actualiza la cantidad (elimina si < 1).
 * - `clearCart()` — Vacía el carrito.
 * - `cartTotal` — Suma del precio × cantidad de todos los artículos.
 * - `cartCount` — Total de unidades en el carrito.
 *
 * @module CartContext
 */
/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect, useContext, useCallback, useMemo } from 'react';

export const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        try {
            const saved = localStorage.getItem('bakery_cart');
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem('bakery_cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = useCallback((product, quantity = 1) => {
        setCartItems(prev => {
            const existing = prev.find(item => item.product.id === product.id);
            const stockLimit = product.stock ?? Infinity;

            if (existing) {
                const newQuantity = Math.min(existing.quantity + quantity, stockLimit);
                return prev.map(item => 
                    item.product.id === product.id ? { ...item, quantity: newQuantity } : item
                );
            }
            
            return [...prev, { product, quantity: Math.min(quantity, stockLimit) }];
        });
    }, []);

    const removeFromCart = useCallback((productId) => {
        setCartItems(prev => prev.filter(item => item.product.id !== productId));
    }, []);

    const updateQuantity = useCallback((productId, quantity) => {
        if (quantity < 1) return removeFromCart(productId);
        
        setCartItems(prev => prev.map(item => {
            if (item.product.id === productId) {
                const stockLimit = item.product.stock ?? Infinity;
                return { ...item, quantity: Math.min(quantity, stockLimit) };
            }
            return item;
        }));
    }, [removeFromCart]);

    const clearCart = useCallback(() => setCartItems([]), []);

    const cartTotal = useMemo(() => 
        cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0),
    [cartItems]);

    const cartCount = useMemo(() => 
        cartItems.reduce((acc, item) => acc + item.quantity, 0),
    [cartItems]);

    const contextValue = useMemo(() => ({
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        cartCount
    }), [cartItems, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount]);

    return (
        <CartContext.Provider value={contextValue}>
            {children}
        </CartContext.Provider>
    );
};
