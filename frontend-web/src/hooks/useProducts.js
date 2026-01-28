import { useState, useEffect } from "react";
import { productService } from "../services/productService";

/**
 * Hook to fetch all products.
 * @returns {{ products: Array, loading: boolean, error: string|null }}
 */
export function useProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const data = await productService.getAllProducts();
                setProducts(data);
            } catch (err) {
                console.error("Failed to fetch products", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    return { products, loading, error };
}

/**
 * Hook to fetch a single product by ID.
 * @param {number|string} id - The product ID.
 * @param {object} [initialData] - Optional initial data to show while fetching/instead of fetching.
 * @returns {{ product: object|null, loading: boolean, error: string|null }}
 */
export function useProduct(id, initialData = null) {
    const [product, setProduct] = useState(initialData);
    const [loading, setLoading] = useState(!initialData);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            if (!id) return;

            // If we have initialData, we might still want to fetch fresh data in background, 
            // or just rely on it. For now, let's fetch to ensure details are up to date, 
            // but we already showed the user the initial data.
            // If we want to skip fetch when we have data:
            // if (initialData) return; 

            // Let's fetch to get "fresh" full details (maybe list has partial data)
            try {
                if (!initialData) setLoading(true); // Only show loading if we don't have data
                const data = await productService.getProductById(id);
                setProduct(data);
            } catch (err) {
                console.error("Failed to fetch product", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id, initialData]);

    return { product, loading, error };
}
