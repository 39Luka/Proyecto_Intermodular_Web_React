/**
 * @fileoverview Servicio REST para compras (pedidos).
 *
 * Todas las operaciones requieren autenticación.
 * Los administradores pueden listar las compras de cualquier usuario.
 * Los usuarios solo acceden a sus propias compras.
 * Las respuestas se normalizan con `mapPurchase`.
 *
 * @module purchaseService
 */
import { apiFetch } from "./api";
import { mapPurchase } from "../utils/mappers";

/** @private */
const extractData = (data) => Array.isArray(data) ? data : (Array.isArray(data?.content) ? data.content : []);

export const purchaseService = {
    /**
     * Lista las compras realizadas. Los administradores pueden filtrar por userId y fechas;
     * los usuarios normales solo pueden ver sus propios pedidos.
     * La API requiere parámetros de paginación (page y size).
     *
     * @param {number} page - Número de página.
     * @param {number} size - Tamaño de página.
     * @param {number|null} userId - Filtro por ID de usuario (solo administradores).
     * @param {string|null} startDate - Fecha inicial en formato ISO 8601.
     * @param {string|null} endDate - Fecha final en formato ISO 8601.
     * @param {string|null} sortBy - Campo por el cual ordenar.
     * @param {string|null} order - Dirección de ordenamiento ("asc" o "desc").
     * @returns {Promise<{ purchases: Array, totalPages: number, totalElements: number }>}
     */
    getAllPurchases: async (page = 0, size = 50, userId = null, startDate = null, endDate = null, sortBy = null, order = null) => {
        const params = new URLSearchParams({ page, size });
        if (userId) params.set("userId", userId);
        if (startDate) params.set("startDate", startDate);
        if (endDate) params.set("endDate", endDate);
        if (sortBy) params.set("sortBy", sortBy);
        if (order) params.set("order", order);
        const data = await apiFetch(`/purchases?${params.toString()}`);
        const purchases = extractData(data).map(mapPurchase);
        return {
            purchases,
            totalPages: data?.totalPages ?? 1,
            totalElements: data?.totalElements ?? purchases.length,
        };
    },

    // GET /purchases/{id}
    getPurchaseById: async (id) => {
        const data = await apiFetch(`/purchases/${id}`);
        if (!data) return null;
        return mapPurchase(data);
    },

    /**
     * Crea una nueva compra. Reduce el stock del producto y aplica opcionalmente una promoción.
     *
     * @param {Array<{productId: number, quantity: number, promotionId?: number}>} items - Líneas de detalle de la compra.
     * @param {number|null} userId - Requerido cuando el llamador tiene el rol ADMIN; ignorado para usuarios normales.
     * @returns {Promise<Object|null>} Compra creada o null si falla.
     */
    createPurchase: async (items, userId = null) => {
        const body = { items };
        // El backend exige userId para los administradores; inofensivo para usuarios normales.
        if (userId !== null && userId !== undefined) body.userId = userId;
        const data = await apiFetch("/purchases", {
            method: "POST",
            body: JSON.stringify(body),
        });
        return data ? mapPurchase(data) : null;
    },

    /**
     * Marca una compra como PAGADA. Retorna 204 No Content.
     * Solo el propietario o un administrador pueden pagar una compra en estado CREATED.
     *
     * @param {number} id - ID de la compra.
     * @returns {Promise<void>}
     */
    payPurchase: async (id) => {
        // Retorna 204 No Content — sin cuerpo que mapear
        await apiFetch(`/purchases/${id}/pay`, { method: "PATCH" });
    },

    /**
     * Cancela una compra. Restaura el stock y libera el uso de promociones aplicadas. Retorna 204.
     * Solo el propietario o un administrador pueden cancelar una compra en estado CREATED.
     *
     * @param {number} id - ID de la compra.
     * @returns {Promise<void>}
     */
    cancelPurchase: async (id) => {
        // Retorna 204 No Content — sin cuerpo que mapear
        await apiFetch(`/purchases/${id}/cancel`, { method: "PATCH" });
    },
};
