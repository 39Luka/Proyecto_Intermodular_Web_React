import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { CartProvider, useCart } from '../../context/CartContext';

// Mock component para consumir CartContext
function TestCartComponent() {
    const { cartItems, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount } = useCart();
    
    return (
        <div>
            <span data-testid="cart-count">{cartCount}</span>
            <span data-testid="cart-total">{cartTotal}</span>
            <span data-testid="items-length">{cartItems.length}</span>
            <button 
                data-testid="add-btn" 
                onClick={() => addToCart({ id: 1, price: 10, stock: 5 }, 2)}
            >
                Add 2 Items
            </button>
            <button 
                data-testid="add-overstock-btn" 
                onClick={() => addToCart({ id: 1, price: 10, stock: 5 }, 10)}
            >
                Add Overstock
            </button>
            <button 
                data-testid="update-btn" 
                onClick={() => updateQuantity(1, 4)}
            >
                Update to 4
            </button>
            <button 
                data-testid="remove-btn" 
                onClick={() => removeFromCart(1)}
            >
                Remove Item 1
            </button>
            <button 
                data-testid="clear-btn" 
                onClick={() => clearCart()}
            >
                Clear
            </button>
        </div>
    );
}

describe('CartContext', () => {
    beforeEach(() => {
        // Limpiamos localStorage antes de cada prueba
        localStorage.clear();
    });

    // CP-015 | hooks/CartContext | inicializa con el carrito vacío y calcula correctamente los totales

    it('inicializa con el carrito vacío y calcula correctamente los totales', () => {
        render(
            <CartProvider>
                <TestCartComponent />
            </CartProvider>
        );

        expect(screen.getByTestId('cart-count').textContent).toBe('0');
        expect(screen.getByTestId('cart-total').textContent).toBe('0');
        expect(screen.getByTestId('items-length').textContent).toBe('0');
    });

    // CP-016 | hooks/CartContext | añade artículos al carrito y respeta los límites de stock

    it('añade artículos al carrito y respeta los límites de stock', () => {
        // CP-02 Carrito - Stock máximo: Evitar añadir más stock del disponible
        render(
            <CartProvider>
                <TestCartComponent />
            </CartProvider>
        );

        // Añadimos 2
        act(() => {
            screen.getByTestId('add-btn').click();
        });

        expect(screen.getByTestId('cart-count').textContent).toBe('2');
        expect(screen.getByTestId('cart-total').textContent).toBe('20');
        
        // Intentamos añadir 10 (excede stock de 5)
        act(() => {
            screen.getByTestId('add-overstock-btn').click();
        });

        // La cantidad se limitará a 5
        expect(screen.getByTestId('cart-count').textContent).toBe('5');
        expect(screen.getByTestId('cart-total').textContent).toBe('50');
    });

    // CP-017 | hooks/CartContext | actualiza la cantidad apropiadamente

    it('actualiza la cantidad apropiadamente', () => {
        render(
            <CartProvider>
                <TestCartComponent />
            </CartProvider>
        );

        // Añadimos 2
        act(() => {
            screen.getByTestId('add-btn').click();
        });
        
        // Actualizamos a 4
        act(() => {
            screen.getByTestId('update-btn').click();
        });

        expect(screen.getByTestId('cart-count').textContent).toBe('4');
        expect(screen.getByTestId('cart-total').textContent).toBe('40');
    });

    // CP-018 | hooks/CartContext | elimina artículos específicos y limpia el carrito

    it('elimina artículos específicos y limpia el carrito', () => {
        render(
            <CartProvider>
                <TestCartComponent />
            </CartProvider>
        );

        // Añadir elemento y luego removerlo
        act(() => {
            screen.getByTestId('add-btn').click();
        });
        expect(screen.getByTestId('items-length').textContent).toBe('1');

        act(() => {
            screen.getByTestId('remove-btn').click();
        });
        expect(screen.getByTestId('items-length').textContent).toBe('0');

        // Añadir y limpiar todo el carro
        act(() => {
            screen.getByTestId('add-btn').click();
        });
        expect(screen.getByTestId('items-length').textContent).toBe('1');

        act(() => {
            screen.getByTestId('clear-btn').click();
        });
        expect(screen.getByTestId('items-length').textContent).toBe('0');
    });
});
