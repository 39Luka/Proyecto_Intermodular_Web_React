import { apiFetch } from "./api";
import { mapPromotion } from "../utils/mappers";

const extractData = (data) => Array.isArray(data) ? data : (Array.isArray(data?.content) ? data.content : []);

export const promotionService = {
    // Public: returns currently active promotions
    getActivePromotions: async (productId = null) => {
        const query = productId ? `?productId=${productId}` : "";
        const data = await apiFetch(`/promotions/active${query}`);
        return extractData(data).map(mapPromotion);
    },

    // Alias for backward compatibility with usePromotions hook
    getAllPromotions: async () => {
        return promotionService.getActivePromotions();
    },

    // Admin only
    getPromotionById: async (id) => {
        const data = await apiFetch(`/promotions/${id}`);
        if (!data) return null;
        return mapPromotion(data);
    },

    getPromotionsByProduct: async (productId) => {
        return promotionService.getActivePromotions(productId);
    },
};
