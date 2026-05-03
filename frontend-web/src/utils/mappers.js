import { formatDate, formatPrice, formatStatus } from "./formatters";

export const mapProduct = (backendProduct) => {
    if (!backendProduct) return null;

    return {
        ...backendProduct,
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

export const mapPromotion = (backendPromotion) => {
    if (!backendPromotion) return null;

    const discount = backendPromotion.discountPercentage ?? null;
    return {
        ...backendPromotion,
        title: backendPromotion.description || "Promocion sin titulo",
        description: discount != null ? `Descuento: ${discount}%` : "Descuento: N/A",
        detailRight: backendPromotion.endDate ? `Hasta: ${formatDate(backendPromotion.endDate)}` : "",
        detailLeft: backendPromotion.productName || "Oferta especial",
        discountPercentage: discount,
    };
};

export const mapPurchase = (backendPurchase) => {
    if (!backendPurchase) return null;

    const statusLabel = formatStatus(backendPurchase.status);
    const dateLabel = backendPurchase.createdAt ? formatDate(backendPurchase.createdAt) : "Fecha no disponible";

    return {
        ...backendPurchase,
        id: backendPurchase.id,
        title: `Compra #${backendPurchase.id} - ${dateLabel}`,
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
