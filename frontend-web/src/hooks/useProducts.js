import { useState, useEffect, useCallback } from "react";
import { productService } from "../services/productService";

export function useProducts(categoryId = null, page = 0, size = 12) {
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
            const result = await productService.getAllProducts(categoryId, page, size);
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
    }, [categoryId, page, size]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    return state;
}

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

