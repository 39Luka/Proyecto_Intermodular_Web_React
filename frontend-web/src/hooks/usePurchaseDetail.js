import { useState, useEffect } from "react";
import { purchaseService } from "../services/purchaseService";
import { productService } from "../services/productService";

/**
 * Hook para obtener los detalles de una compra, incluyendo líneas y nombres de productos.
 * @param {number|string} purchaseId - El ID de la compra.
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

            // 1. Obtener datos de la compra (esencial)
            try {
                const purchaseData = await purchaseService.getPurchaseById(purchaseId);
                if (purchaseData) {
                    setPurchase(purchaseData);
                    currentPurchase = purchaseData;

                    // Establecer detalles a partir de los datos de la compra usando el subtotal de la API
                    const rawItems = purchaseData.items || [];
                    const initialDetails = rawItems.map((item, index) => ({
                        id: `line-${index}-${item.productId || item.productoId}`,
                        purchaseId: purchaseId,
                        productId: item.productId || item.productoId,
                        title: item.productName || item.nombreProducto,
                        quantity: item.quantity ?? item.cantidad,
                        subtotal: item.subtotal // Usar el subtotal directamente desde la API
                    }));
                    setDetails(initialDetails);
                } else {
                    // Compra no encontrada (null)
                }
            } catch (err) {
                console.error("Error al obtener los detalles de la compra", err);
                setError(err.message);
                hasError = true;
            } finally {
                // Mostrar el contenido tan pronto como tengamos la información de la compra
                setLoading(false);
            }

            if (hasError || !currentPurchase) return;

            // 2. Obtener productos para resolver imágenes/descripciones (enriquecimiento)
            // Esto ocurre en segundo plano; los errores aquí no deberían bloquear la vista principal.
            try {
                const { products: allProducts } = await productService.getAllProducts(null, 0, 100);
                const pMap = {};
                allProducts.forEach(p => {
                    pMap[p.id] = p;
                });
                setProductsMap(pMap);
                // No es necesario volver a calcular precios ni actualizar los detalles de nuevo

            } catch (err) {
                console.warn("No se pudieron obtener los productos para el enriquecimiento (pueden faltar precios/imágenes)", err);
            }
        };

        fetchData();
    }, [purchaseId]);

    return { purchase, details, productsMap, loading, error };
}
