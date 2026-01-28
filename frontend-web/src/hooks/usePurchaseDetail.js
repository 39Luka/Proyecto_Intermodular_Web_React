import { useState, useEffect } from "react";
import { purchaseService } from "../services/purchaseService";
import { productService } from "../services/productService";

/**
 * Hook to fetch purchase details, including lines and product names.
 * @param {number|string} purchaseId - The purchase ID.
 * @returns {{ purchase: object|null, details: Array, productsMap: object, loading: boolean, error: string|null }}
 */
export function usePurchaseDetail(purchaseId) {
    const [purchase, setPurchase] = useState(null);
    const [details, setDetails] = useState([]);
    const [productsMap, setProductsMap] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!purchaseId) return;
            setLoading(true);

            let hasError = false;
            let currentPurchase = null;

            // 1. Fetch Purchase data (essential)
            try {
                const purchaseData = await purchaseService.getPurchaseById(purchaseId);
                if (purchaseData) {
                    setPurchase(purchaseData);
                    currentPurchase = purchaseData;

                    // Set details from purchase data using API subtotal
                    const rawItems = purchaseData.items || [];
                    const initialDetails = rawItems.map((item, index) => ({
                        id: `line-${index}-${item.productoId}`,
                        purchaseId: purchaseId,
                        productId: item.productoId,
                        title: item.nombreProducto,
                        quantity: item.cantidad,
                        subtotal: item.subtotal // Use subtotal directly from API
                    }));
                    setDetails(initialDetails);
                } else {
                    // Purchase not found (null)
                }
            } catch (err) {
                console.error("Failed to fetch purchase details", err);
                setError(err.message);
                hasError = true;
            } finally {
                // Show content as soon as we have the purchase info
                setLoading(false);
            }

            if (hasError || !currentPurchase) return;

            // 2. Fetch Products to resolve images/descriptions (enrichment)
            // This happens in background; errors here shouldn't block the main view.
            try {
                const allProducts = await productService.getAllProducts();
                const pMap = {};
                allProducts.forEach(p => {
                    pMap[p.id] = p;
                });
                setProductsMap(pMap);
                // No need to recalculate prices or update details again

            } catch (err) {
                console.warn("Could not fetch products for enrichment (prices/images might be missing)", err);
            }
        };

        fetchData();
    }, [purchaseId]);

    return { purchase, details, productsMap, loading, error };
}
