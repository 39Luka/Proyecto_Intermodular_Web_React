import { apiFetch } from "./api";
import { mapPromotion } from "../utils/mappers";

const extractData = (data) => Array.isArray(data) ? data : (Array.isArray(data?.content) ? data.content : []);

export const promotionService = {
    /**
     * Public endpoint — returns active percentage promotions for a product.
     * If userId is provided, filters out promotions already used by that user.
     * Requires pageable params.
     * @param {number} productId - Required: product to get promotions for
     * @param {number|null} userId - Optional: filter out already-used promotions
     * @param {number} page
     * @param {number} size
     */
    getActivePromotions: async (productId, userId = null, page = 0, size = 10) => {
        if (!productId) return [];
        const params = new URLSearchParams({ productId, page, size });
        if (userId) params.set("userId", userId);
        // skipAuth=true: GET /promotions/active is a public endpoint
        const data = await apiFetch(`/promotions/active?${params.toString()}`, {}, true);
        return extractData(data).map(mapPromotion);
    },

    /**
     * Admin-only: Lists all promotions with pagination.
     * @param {number} page
     * @param {number} size
     */
    getAllPromotions: async (page = 0, size = 50) => {
        const params = new URLSearchParams({ page, size });
        const data = await apiFetch(`/promotions?${params.toString()}`);
        return extractData(data).map(mapPromotion);
    },

    /**
     * Admin-only: Get promotion by ID.
     * @param {number} id
     */
    getPromotionById: async (id) => {
        const data = await apiFetch(`/promotions/${id}`);
        if (!data) return null;
        return mapPromotion(data);
    },

    /**
     * Admin-only: Create a percentage promotion for a product.
     * @param {{ description, startDate, endDate, productId, discountPercentage }} payload
     */
    createPercentagePromotion: async (payload) => {
        const data = await apiFetch("/promotions/percentage", {
            method: "POST",
            body: JSON.stringify(payload),
        });
        return data ? mapPromotion(data) : null;
    },

    /**
     * Admin-only: Toggle promotion active flag.
     * Returns 204 No Content.
     * @param {number} id
     * @param {boolean} active
     */
    patchPromotion: async (id, active) => {
        await apiFetch(`/promotions/${id}`, {
            method: "PATCH",
            body: JSON.stringify({ active }),
        });
    },
};
