import { useState, useEffect } from "react";
import { promotionService } from "../services/promotionService";

/**
 * Hook to fetch all promotions.
 * @returns {{ promotions: Array, loading: boolean, error: string|null }}
 */
export function usePromotions() {
    const [promotions, setPromotions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPromotions = async () => {
            try {
                setLoading(true);
                // The API requires a productId to fetch active promotions.
                // We'll fetch all products first, then fetch promotions for each.
                const { productService } = await import("../services/productService");
                const products = await productService.getAllProducts();
                
                // Fetch promotions for all products concurrently
                const allPromosPromises = products.map(p => 
                    promotionService.getActivePromotions(p.id)
                );
                
                const responses = await Promise.all(allPromosPromises);
                
                // Flatten the results into a single array
                const allPromotions = responses.flat();
                setPromotions(allPromotions);
            } catch (err) {
                console.error("Failed to fetch promotions", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPromotions();
    }, []);

    return { promotions, loading, error };
}
