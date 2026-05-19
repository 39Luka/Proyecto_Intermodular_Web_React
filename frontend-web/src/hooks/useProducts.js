import { useState, useEffect, useCallback } from "react";
import { productService } from "../services/productService";

/**
 * Hook para obtener una lista paginada de productos con filtros opcionales.
 *
 * Ejecuta la petición automáticamente cuando cambia cualquier parámetro.
 * Gestiona los estados de carga y error internamente.
 *
 * @param {number|null} [categoryId=null] - Filtra por ID de categoría. `null` = todas las categorías.
 * @param {number}      [page=0]          - Página a cargar (índice base 0).
 * @param {number}      [size=12]         - Número de elementos por página.
 * @param {string|null} [name=null]       - Filtra por nombre (búsqueda parcial).
 * @param {string|null} [sortBy=null]     - Campo por el que ordenar (ej. `"price"`).
 * @param {string|null} [order=null]      - Dirección del orden: `"asc"` o `"desc"`.
 * @returns {{
 *   products: Array,
 *   totalPages: number,
 *   totalElements: number,
 *   loading: boolean,
 *   error: string|null
 * }} Estado actual de la petición.
 *
 * @example
 * const { products, totalPages, loading, error } = useProducts(null, page, 12, searchTerm);
 */
export function useProducts(categoryId = null, page = 0, size = 12, name = null, sortBy = null, order = null) {
    const [state, setState] = useState({ 
        products: [], 
        totalPages: 1, 
        totalElements: 0, 
        loading: true, 
        error: null 
    });

    const fetchProducts = useCallback(async () => {
        try {
            setState(s => ({ ...s, loading: true, error: null }));
            const result = await productService.getAllProducts(categoryId, page, size, name, sortBy, order);
            setState({
                products: result.products,
                totalPages: result.totalPages,
                totalElements: result.totalElements,
                loading: false,
                error: null
            });
        } catch (err) {
            setState(s => ({ ...s, loading: false, error: err.message }));
        }
    }, [categoryId, page, size, name, sortBy, order]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    return state;
}

/**
 * Hook para obtener los productos más vendidos de la tienda.
 *
 * Solicita los top-selling al iniciar y rellena con productos normales
 * si no hay suficientes entradas de ventas registradas.
 *
 * @returns {{ products: Array, loading: boolean, error: string|null }}
 *
 * @example
 * const { products, loading } = useTopSelling();
 */
export function useTopSelling() {
    const [state, setState] = useState({ products: [], loading: true, error: null });

    useEffect(() => {
        const fetch = async () => {
            try {
                const data = await productService.getTopSelling();
                setState({ products: data, loading: false, error: null });
            } catch (err) {
                setState({ products: [], loading: false, error: err.message });
            }
        };
        fetch();
    }, []);

    return state;
}

/**
 * Hook para obtener el detalle de un producto por su ID.
 *
 * Si se proporciona `initialData` (producto ya cargado, ej. desde estado de navegación)
 * la petición de red se omite inicialmente. La petición se lanza cuando `id` cambia.
 *
 * @param {number|string} id              - ID del producto a cargar.
 * @param {Object|null}   [initialData=null] - Datos previos para evitar un flash de carga.
 * @returns {{ product: Object|null, loading: boolean, error: string|null }}
 *
 * @example
 * const { product, loading, error } = useProduct(productId);
 */
export function useProduct(id, initialData = null) {
    const [state, setState] = useState({ product: initialData, loading: !initialData, error: null });

    useEffect(() => {
        if (!id) return;
        const fetch = async () => {
            try {
                if (!initialData) setState(s => ({ ...s, loading: true }));
                const data = await productService.getProductById(id);
                setState({ product: data, loading: false, error: null });
            } catch (err) {
                setState({ product: null, loading: false, error: err.message });
            }
        };
        fetch();
    }, [id, initialData]);

    return state;
}

