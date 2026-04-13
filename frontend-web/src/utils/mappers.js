import { formatStatus, formatDate, formatPrice } from "./formatters";

/**
 * Maps a backend product object to the frontend product structure.
 * The API uses English field names: name, description, price, stock, active, categoryId.
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
 * API PromotionResponse fields: id, description, type, startDate, endDate, active,
 * productId, productName, discountPercentage.
 */
export const mapPromotion = (backendPromo) => {
    if (!backendPromo) return null;
    const discount = backendPromo.discountPercentage ?? null;
    return {
        ...backendPromo,
        // The API field is `description`, not `name` or `descripcion`
        title: backendPromo.description || "Promoción sin título",
        description: discount != null ? `Descuento: ${discount}%` : "Descuento: N/A",
        detailRight: backendPromo.endDate ? `Hasta: ${formatDate(backendPromo.endDate)}` : "",
        detailLeft: backendPromo.productName || "Oferta Especial",
        discountPercentage: discount,
    };
};

/**
 * Maps a backend purchase object to the frontend structure.
 * API PurchaseResponse status values: CREATED, PAID, CANCELLED.
 */
export const mapPurchase = (backendPurchase) => {
    if (!backendPurchase) return null;
    const statusLabel = formatStatus(backendPurchase.status);
    const dateLabel = backendPurchase.createdAt ? formatDate(backendPurchase.createdAt) : "Fecha no disponible";
    return {
        ...backendPurchase,
        id: backendPurchase.id,
        title: `Compra #${backendPurchase.id} — ${dateLabel}`,
        description: `Estado: ${statusLabel}`,
        detailRight: backendPurchase.total != null ? `Total: ${formatPrice(backendPurchase.total)}` : "",
        detailLeft: statusLabel,
        items: Array.isArray(backendPurchase.items)
            ? backendPurchase.items
            : Array.isArray(backendPurchase.detalles)
                ? backendPurchase.detalles
                : [],
    };
};

/**
 * Maps a backend purchase line item object.
 * API PurchaseItemResponse fields: productId, productName, quantity, unitPrice,
 * discountAmount, subtotal, promotionId.
 */
export const mapPurchaseDetail = (backendDetail) => {
    if (!backendDetail) return null;
    return {
        id: backendDetail.id,
        purchaseId: backendDetail.purchaseId || backendDetail.compraId,
        productId: backendDetail.productId || backendDetail.productoId,
        productName: backendDetail.productName || backendDetail.nombreProducto || "",
        quantity: backendDetail.quantity ?? backendDetail.cantidad ?? 0,
        unitPrice: backendDetail.unitPrice ?? 0,
        discountAmount: backendDetail.discountAmount ?? 0,
        subtotal: backendDetail.subtotal ?? 0,
        promotionId: backendDetail.promotionId ?? null,
    };
};
