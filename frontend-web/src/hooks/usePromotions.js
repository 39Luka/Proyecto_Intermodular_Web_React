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
                const data = await promotionService.getAllPromotions();
                setPromotions(data);
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
