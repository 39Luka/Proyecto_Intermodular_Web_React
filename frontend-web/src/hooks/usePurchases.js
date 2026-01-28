import { useState, useEffect } from "react";
import { purchaseService } from "../services/purchaseService";

/**
 * Hook to fetch all purchases.
 * @returns {{ purchases: Array, loading: boolean, error: string|null }}
 */
export function usePurchases() {
    const [purchases, setPurchases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPurchases = async () => {
            try {
                setLoading(true);
                const data = await purchaseService.getAllPurchases();
                setPurchases(data);
            } catch (err) {
                console.error("Failed to fetch purchases", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPurchases();
    }, []);

    return { purchases, loading, error };
}
