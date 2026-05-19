/**
 * @fileoverview Servicio REST para promociones de productos.
 *
 * - `getActivePromotions` es público (skipAuth=true).
 * - El resto de métodos requieren rol ADMIN.
 * Todas las respuestas pasan por `mapPromotion` para normalizar el modelo.
 *
 * @module promotionService
 */
import { apiFetch } from "./api";
import { mapPromotion } from "../utils/mappers";

/** @private */
const extractData = (data) => Array.isArray(data) ? data : (Array.isArray(data?.content) ? data.content : []);

export const promotionService = {
    /**
     * Endpoint público: obtiene promociones activas basadas en porcentaje para un producto.
     * Si se proporciona userId, filtra las promociones que ese usuario ya ha utilizado.
     * Requiere parámetros de paginación.
     *
     * @param {number} productId - Requerido: ID del producto para el cual obtener promociones.
     * @param {number|null} userId - Opcional: ID del usuario para filtrar promociones usadas.
     * @param {number} page - Número de página.
     * @param {number} size - Tamaño de página.
     * @returns {Promise<Array>} Listado de promociones mapeadas y normalizadas.
     */
    getActivePromotions: async (productId, userId = null, page = 0, size = 10) => {
        if (!productId) return [];
        const params = new URLSearchParams({ productId, page, size });
        if (userId) params.set("userId", userId);
        // skipAuth=true: GET /promotions/active es un endpoint público
        const data = await apiFetch(`/promotions/active?${params.toString()}`, {}, true);
        return extractData(data).map(mapPromotion);
    },

    /**
     * Solo Admin: Lista todas las promociones con paginación.
     *
     * @param {number} page - Número de página.
     * @param {number} size - Tamaño de página.
     * @returns {Promise<Array>}
     */
    getAllPromotions: async (page = 0, size = 50) => {
        const params = new URLSearchParams({ page, size });
        const data = await apiFetch(`/promotions?${params.toString()}`);
        return extractData(data).map(mapPromotion);
    },

    /**
     * Solo Admin: Obtiene una promoción por su ID único.
     *
     * @param {number} id - ID de la promoción.
     * @returns {Promise<Object|null>}
     */
    getPromotionById: async (id) => {
        const data = await apiFetch(`/promotions/${id}`);
        if (!data) return null;
        return mapPromotion(data);
    },

    /**
     * Solo Admin: Crea una promoción basada en porcentaje para un producto.
     *
     * @param {{ description: string, startDate: string, endDate: string, productId: number, discountPercentage: number }} payload - Datos de la promoción.
     * @returns {Promise<Object|null>}
     */
    createPercentagePromotion: async (payload) => {
        const data = await apiFetch("/promotions/percentage", {
            method: "POST",
            body: JSON.stringify(payload),
        });
        return data ? mapPromotion(data) : null;
    },

    /**
     * Solo Admin: Cambia el estado de activación de una promoción.
     * Retorna 204 No Content.
     *
     * @param {number} id - ID de la promoción.
     * @param {boolean} active - Estado activo/inactivo.
     * @returns {Promise<void>}
     */
    patchPromotion: async (id, active) => {
        await apiFetch(`/promotions/${id}`, {
            method: "PATCH",
            body: JSON.stringify({ active }),
        });
    },
};
