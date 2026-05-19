import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import { SearchProvider, useSearch } from '../../context/SearchContext';

// Un componente de prueba para consumir y modificar el contexto
function TestComponent() {
    const { searchTerm, setSearchTerm } = useSearch();
    const navigate = useNavigate();

    return (
        <div>
            <span data-testid="search-val">{searchTerm}</span>
            <button onClick={() => setSearchTerm('croissant')} data-testid="set-btn">Set</button>
            <button onClick={() => navigate('/otra-ruta')} data-testid="nav-btn">Nav</button>
        </div>
    );
}

describe('SearchContext', () => {
    // CP-019 | hooks/SearchContext | proporciona valores predeterminados y permite actualizaciones
    it('proporciona valores predeterminados y permite actualizaciones', () => {
        render(
            <MemoryRouter initialEntries={['/']}>
                <SearchProvider>
                    <TestComponent />
                </SearchProvider>
            </MemoryRouter>
        );

        // Inicialmente vacío
        expect(screen.getByTestId('search-val').textContent).toBe('');

        // Actualizamos valor
        act(() => {
            screen.getByTestId('set-btn').click();
        });

        // Debe haberse actualizado
        expect(screen.getByTestId('search-val').textContent).toBe('croissant');
    });

    // CP-020 | hooks/SearchContext | restablece el estado de búsqueda cuando ocurre una navegación

    it('restablece el estado de búsqueda cuando ocurre una navegación', () => {
        render(
            <MemoryRouter initialEntries={['/']}>
                <SearchProvider>
                    <TestComponent />
                </SearchProvider>
            </MemoryRouter>
        );

        // Actualizamos valor
        act(() => {
            screen.getByTestId('set-btn').click();
        });
        expect(screen.getByTestId('search-val').textContent).toBe('croissant');

        // Navegamos a otra página (esto cambia el location.pathname)
        act(() => {
            screen.getByTestId('nav-btn').click();
        });

        // El contexto debería haber detectado el cambio de ruta y vaciado el buscador
        expect(screen.getByTestId('search-val').textContent).toBe('');
    });
});
