import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CardHorizontal from '../../components/cards/CardHorizontal';
import { vi } from 'vitest';

describe('CardHorizontal Component', () => {
    const mockProduct = {
        id: 10,
        title: 'Tarta de Queso',
        description: 'Tarta casera al horno',
        price: 15.5,
        image: '/img/tarta.png',
        stock: 5,
        category: { name: 'Postres' }
    };

    const renderWithRouter = (ui) => {
        return render(<BrowserRouter>{ui}</BrowserRouter>);
    };

    // CP-001 | components/CardHorizontal | renderiza los detalles del producto correctamente

    it('renderiza los detalles del producto correctamente', () => {
        renderWithRouter(<CardHorizontal {...mockProduct} />);

        expect(screen.getByText('Tarta de Queso')).toBeInTheDocument();
        expect(screen.getByText('Tarta casera al horno')).toBeInTheDocument();
        
        // Verifica que la imagen tiene el src y alt correctos
        const img = screen.getByRole('img');
        expect(img).toHaveAttribute('src', '/img/tarta.png');
        expect(img).toHaveAttribute('alt', 'Imagen de Tarta de Queso ');
    });

    // CP-002 | components/CardHorizontal | formatea y muestra el precio correctamente

    it('formatea y muestra el precio correctamente', () => {
        renderWithRouter(<CardHorizontal {...mockProduct} />);
        
        // El componente formatea 15.5 como "15.50 EUR"
        expect(screen.getByText('15.50 EUR')).toBeInTheDocument();
    });

    // CP-003 | components/CardHorizontal | llama a onNavigate al hacer clic en el contenedor principal

    it('llama a onNavigate al hacer clic en el contenedor principal', () => {
        const handleNavigate = vi.fn();
        renderWithRouter(<CardHorizontal {...mockProduct} onNavigate={handleNavigate} />);
        
        const cardContainer = screen.getByRole('button');
        fireEvent.click(cardContainer);
        
        expect(handleNavigate).toHaveBeenCalledTimes(1);
        expect(handleNavigate).toHaveBeenCalledWith(10);
    });

    // CP-004 | components/CardHorizontal | muestra la cinta de agotado cuando el stock es 0

    it('muestra la cinta de agotado cuando el stock es 0', () => {
        renderWithRouter(<CardHorizontal {...mockProduct} stock={0} />);
        
        expect(screen.getByText('Agotado')).toBeInTheDocument();
        expect(screen.getByText('No disponible')).toBeInTheDocument();
    });
});
