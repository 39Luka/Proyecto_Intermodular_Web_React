import { formatStatus } from "./formatters";

/**
 * Maps a backend product object to the frontend product structure.
 * @param {object} backendProduct - The product object from the API.
 * @returns {object|null} - The mapped product object for the frontend.
 */
export const mapProduct = (backendProduct) => {
    if (!backendProduct) return null;
    return {
        ...backendProduct,
        title: backendProduct.nombre || "Producto sin nombre",
        price: backendProduct.precio ?? 0,
        description: backendProduct.descripcion || "",
        image: backendProduct.image || "https://via.placeholder.com/140x140/e5e7eb/6b7280?text=Producto"
    };
};

/**
 * Maps a backend promotion object to the frontend promotion structure.
 * @param {object} backendPromo - The promotion object from the API.
 * @returns {object|null} - The mapped promotion object for the frontend.
 */
export const mapPromotion = (backendPromo) => {
    if (!backendPromo) return null;
    return {
        ...backendPromo,
        title: backendPromo.descripcion || "Promoción sin título",
        description: backendPromo.descuento != null ? `Descuento: ${backendPromo.descuento}%` : "Descuento: N/A",
        detailRight: backendPromo.fechaFin || "",
        detailLeft: "Oferta Especial"
    };
};

/**
 * Maps a backend purchase object to the frontend purchase structure.
 * @param {object} backendPurchase - The purchase object from the API.
 * @returns {object|null} - The mapped purchase object for the frontend.
 */
export const mapPurchase = (backendPurchase) => {
    if (!backendPurchase) return null;
    return {
        ...backendPurchase,
        id: backendPurchase.id,
        title: backendPurchase.fecha || "Fecha no disponible",
        description: `Estado: ${formatStatus(backendPurchase.estado) || "Desconocido"}`,
        detailRight: `ID: ${backendPurchase.id ?? "N/A"}`,
        detailLeft: "",
        items: Array.isArray(backendPurchase.detalles)
            ? backendPurchase.detalles
            : Array.isArray(backendPurchase.productos)
                ? backendPurchase.productos
                : []
    };
};

/**
 * Maps a backend purchase detail object to the frontend structure.
 * @param {object} backendDetail - The detail object from the API.
 * @returns {object|null} - The mapped detail object.
 */
export const mapPurchaseDetail = (backendDetail) => {
    if (!backendDetail) return null;
    return {
        id: backendDetail.id,
        purchaseId: backendDetail.compraId,
        productId: backendDetail.productoId,
        quantity: backendDetail.cantidad ?? 0,
        subtotal: backendDetail.subtotal ?? 0
    };
};
