import { formatStatus } from "./formatters";

/**
 * Maps a backend product object to the frontend product structure.
 * The new API uses English field names: name, description, price, stock, active, category.
 */
export const mapProduct = (backendProduct) => {
    if (!backendProduct) return null;
    return {
        ...backendProduct,
        // Support both old (nombre/precio) and new (name/price) API field names
        title: backendProduct.name || backendProduct.nombre || "Producto sin nombre",
        price: backendProduct.price ?? backendProduct.precio ?? 0,
        description: backendProduct.description || backendProduct.descripcion || "",
        stock: backendProduct.stock ?? null,
        active: backendProduct.active ?? true,
        category: backendProduct.category || null,
        image: backendProduct.imageUrl || backendProduct.image ||
            "https://via.placeholder.com/140x140/e5e7eb/6b7280?text=Producto",
    };
};

/**
 * Maps a backend promotion object to the frontend structure.
 * The new API returns percentage promotions with discountPercentage.
 */
export const mapPromotion = (backendPromo) => {
    if (!backendPromo) return null;
    const discount = backendPromo.discountPercentage ?? backendPromo.descuento ?? null;
    return {
        ...backendPromo,
        title: backendPromo.name || backendPromo.descripcion || "Promoción sin título",
        description: discount != null ? `Descuento: ${discount}%` : "Descuento: N/A",
        detailRight: backendPromo.endDate || backendPromo.fechaFin || "",
        detailLeft: "Oferta Especial",
        discountPercentage: discount,
    };
};

/**
 * Maps a backend purchase object to the frontend structure.
 * The new API uses status values like PENDING, PAID, CANCELLED.
 */
export const mapPurchase = (backendPurchase) => {
    if (!backendPurchase) return null;
    return {
        ...backendPurchase,
        id: backendPurchase.id,
        title: backendPurchase.createdAt || backendPurchase.fecha || "Fecha no disponible",
        description: `Estado: ${formatStatus(backendPurchase.status || backendPurchase.estado) || "Desconocido"}`,
        detailRight: `ID: ${backendPurchase.id ?? "N/A"}`,
        detailLeft: "",
        items: Array.isArray(backendPurchase.items)
            ? backendPurchase.items
            : Array.isArray(backendPurchase.detalles)
                ? backendPurchase.detalles
                : [],
    };
};

/**
 * Maps a backend purchase detail/line item object.
 * The new API wraps these inside each purchase under items[].
 */
export const mapPurchaseDetail = (backendDetail) => {
    if (!backendDetail) return null;
    return {
        id: backendDetail.id,
        purchaseId: backendDetail.purchaseId || backendDetail.compraId,
        productId: backendDetail.productId || backendDetail.productoId,
        productName: backendDetail.productName || backendDetail.nombreProducto || "",
        quantity: backendDetail.quantity ?? backendDetail.cantidad ?? 0,
        subtotal: backendDetail.subtotal ?? 0,
    };
};
