/**
 * @fileoverview Funciones de mapeo para normalizar datos del backend.
 *
 * Cada función `map*` transforma la respuesta cruda de la API REST a un modelo
 * consistente que consume el frontend. Esto permite que los componentes no
 * dependan de la estructura exacta del backend y facilita la gestión de campos
 * opcionales, valores por defecto e imágenes base64.
 *
 * @module mappers
 */
import { formatDate, formatPrice, formatStatus } from "./formatters";

/**
 * URL de la imagen por defecto para productos sin imagen.
 * Se usa también como fallback `onError` en los componentes `<img>`.
 * @constant {string}
 */
export const DEFAULT_PRODUCT_IMAGE = "/logo-croassantina.svg";

/**
 * Normaliza un producto del backend al modelo del frontend.
 *
 * Resuelve la imagen (base64, URL o fallback), unifica nombres de campo
 * (español/inglés) y establece valores por defecto.
 *
 * @param {Object} backendProduct - Objeto crudo devuelto por la API.
 * @returns {{ id:number, title:string, price:number, description:string, stock:number|null, active:boolean, category:Object|null, image:string }|null}
 *   Producto normalizado o `null` si la entrada es falsy.
 */
export const mapProduct = (backendProduct) => {
    if (!backendProduct) return null;

    let image = backendProduct.imageBase64 || backendProduct.imageUrl || backendProduct.image;
    
    if (image && backendProduct.imageBase64 && !image.startsWith("data:")) {
        image = `data:image/jpeg;base64,${image}`;
    }

    image = image || DEFAULT_PRODUCT_IMAGE;

    return {
        ...backendProduct,
        title: backendProduct.name || backendProduct.nombre || "Producto sin nombre",
        price: backendProduct.price ?? backendProduct.precio ?? 0,
        description: backendProduct.description || backendProduct.descripcion || "",
        stock: backendProduct.stock ?? null,
        active: backendProduct.active ?? true,
        category: backendProduct.category || null,
        image,
    };
};

/**
 * Normaliza una promoción del backend al modelo del frontend.
 *
 * Genera campos de presentación (`title`, `description`, `detailLeft`, `detailRight`)
 * a partir de los campos crudos de la API.
 *
 * @param {Object} backendPromotion - Objeto crudo devuelto por la API.
 * @returns {{ id:number, title:string, description:string, detailLeft:string, detailRight:string, discountPercentage:number|null }|null}
 */
export const mapPromotion = (backendPromotion) => {
    if (!backendPromotion) return null;

    const discount = backendPromotion.discountPercentage ?? null;
    return {
        ...backendPromotion,
        title: backendPromotion.description || "Promoción sin título",
        description: discount != null ? `Descuento: ${discount}%` : "Descuento: N/A",
        detailRight: backendPromotion.endDate ? `Hasta: ${formatDate(backendPromotion.endDate)}` : "",
        detailLeft: backendPromotion.productName || "Oferta especial",
        discountPercentage: discount,
    };
};

/**
 * Normaliza una compra del backend al modelo del frontend.
 *
 * Genera un `title` legible con el número de pedido y la fecha, traduce el
 * estado a español y extrae las líneas de detalle (`items`).
 *
 * @param {Object} backendPurchase - Objeto crudo devuelto por la API.
 * @returns {{ id:number, title:string, description:string, detailLeft:string, detailRight:string, items:Array }|null}
 */
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

/**
 * Normaliza una línea de detalle de compra del backend.
 *
 * Unifica los nombres de campo (español/inglés) y establece valores numéricos
 * por defecto a `0` para evitar errores de cálculo.
 *
 * @param {Object} backendDetail - Línea de detalle cruda de la API.
 * @returns {{ id:any, purchaseId:any, productId:any, productName:string, quantity:number, unitPrice:number, discountAmount:number, subtotal:number, promotionId:number|null }|null}
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
