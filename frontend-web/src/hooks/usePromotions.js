import { useState, useEffect } from "react";
import { promotionService } from "../services/promotionService";

/**
 * Hook to fetch all active promotions visible to the current user.
 *
 * Strategy:
 * - GET /promotions/active requires a productId (public endpoint).
 * - We first fetch all products, then fetch active promotions for each one.
 * - Results are deduplicated by promotion ID.
 *
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
                // Import productService here to avoid circular deps
                const { productService } = await import("../services/productService");
                const products = await productService.getAllProducts();

                if (products.length === 0) {
                    setPromotions([]);
                    return;
                }

                // Fetch promotions for all products concurrently
                const allPromosResults = await Promise.allSettled(
                    products.map((p) => promotionService.getActivePromotions(p.id))
                );

                // Flatten and deduplicate by promotion ID
                const seen = new Set();
                const allPromotions = [];
                for (const result of allPromosResults) {
                    if (result.status === "fulfilled") {
                        for (const promo of result.value) {
                            if (!seen.has(promo.id)) {
                                seen.add(promo.id);
                                allPromotions.push(promo);
                            }
                        }
                    }
                }

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

