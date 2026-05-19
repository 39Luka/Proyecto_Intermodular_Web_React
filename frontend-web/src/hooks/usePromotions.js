import { useState, useEffect } from "react";
import { promotionService } from "../services/promotionService";
import { useAuth } from "./useAuth";

/**
 * Hook para obtener todas las promociones activas visibles para el usuario actual.
 *
 * Estrategia:
 * - GET /promotions/active requiere un productId (endpoint público).
 * - Primero obtenemos todos los productos y luego obtenemos las promociones activas de cada uno.
 * - Los resultados se deduplican según el ID de la promoción.
 *
 * @returns {{ promotions: Array, loading: boolean, error: string|null }}
 */
export function usePromotions() {
    const { user } = useAuth();
    const [promotions, setPromotions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPromotions = async () => {
            try {
                setLoading(true);
                // Importar productService aquí para evitar dependencias circulares
                const { productService } = await import("../services/productService");
                const { products } = await productService.getAllProducts();
                if (!products || !Array.isArray(products) || products.length === 0) {
                    setPromotions([]);
                    return;
                }

                // Obtener promociones para todos los productos de forma concurrente, pasando el userId para ignorar las promociones ya utilizadas
                const allPromosResults = await Promise.allSettled(
                    products.map((p) => promotionService.getActivePromotions(p.id, user?.id))
                );

                // Aplanar y deduplicar por el ID de la promoción
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
                console.error("Error al obtener las promociones", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPromotions();
    }, [user?.id]);

    return { promotions, loading, error };
}

