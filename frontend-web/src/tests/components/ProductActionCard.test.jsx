import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import ProductActionCard from '../../components/product/ProductActionCard';

describe('ProductActionCard Component', () => {
    const mockProduct = {
        id: 1,
        price: 12.5,
        stock: 5,
        category: { name: 'Especialidades' }
    };

    // CP-011 | components/ProductActionCard | renderiza el precio y el stock correctamente

    it('renderiza el precio y el stock correctamente', () => {
        render(<ProductActionCard product={mockProduct} onAddToCart={vi.fn()} />);

        expect(screen.getByText('12.50 EUR')).toBeInTheDocument();
        expect(screen.getByText('5 unidades')).toBeInTheDocument();
        expect(screen.getByText('Especialidades')).toBeInTheDocument();
    });

    // CP-012 | components/ProductActionCard | deshabilita el botón y muestra el estado agotado cuando el stock es 0

    it('deshabilita el botón y muestra el estado agotado cuando el stock es 0', () => {
        const outOfStockProduct = { ...mockProduct, stock: 0 };
        render(<ProductActionCard product={outOfStockProduct} onAddToCart={vi.fn()} />);

        expect(screen.getAllByText('Agotado').length).toBe(2); // Ribbons/Text y Botón
        expect(screen.getByRole('button')).toBeDisabled();
        
        // Verifica que NO se muestre el input de cantidad
        expect(screen.queryByLabelText('Cantidad')).not.toBeInTheDocument();
    });

    // CP-013 | components/ProductActionCard | llama a onAddToCart con la cantidad seleccionada cuando se hace clic en el botón

    it('llama a onAddToCart con la cantidad seleccionada cuando se hace clic en el botón', async () => {
        const handleAddToCart = vi.fn();
        render(<ProductActionCard product={mockProduct} onAddToCart={handleAddToCart} />);

        const user = userEvent.setup();
        const input = screen.getByLabelText('Cantidad');
        
        // Cambiar cantidad a 3 simulando directamente un evento de input de tipo número
        fireEvent.change(input, { target: { value: '3' } });

        // Hacer click en Añadir
        const addButton = screen.getByRole('button', { name: /Añadir al carrito/i });
        await user.click(addButton);

        expect(handleAddToCart).toHaveBeenCalledTimes(1);
        expect(handleAddToCart).toHaveBeenCalledWith(3);
    });

    // CP-014 | components/ProductActionCard | restringe el input de cantidad para no exceder el stock disponible

    it('restringe el input de cantidad para no exceder el stock disponible', async () => {
        const handleAddToCart = vi.fn();
        render(<ProductActionCard product={mockProduct} onAddToCart={handleAddToCart} />);

        const user = userEvent.setup();
        const input = screen.getByLabelText('Cantidad');
        
        // El mockProduct tiene 5 de stock. Intentamos escribir 10.
        // El onChange ejecuta Math.min(val, stock) limitando a 5
        await user.clear(input);
        await user.type(input, '10');

        // Hacer click en Añadir
        const addButton = screen.getByRole('button', { name: /Añadir al carrito/i });
        await user.click(addButton);

        expect(input.value).toBe('5');
        expect(handleAddToCart).toHaveBeenCalledWith(5);
    });
});
