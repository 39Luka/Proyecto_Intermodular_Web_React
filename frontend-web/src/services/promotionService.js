export const promotionService = {
    getAllPromotions: async () => {
        const data = await apiFetch("/promociones");
        return (data || []).map(mapPromotion);
    },

    getPromotionById: async (id) => {
        const data = await apiFetch(`/promociones/${id}`);
        if (!data) return null;
        return mapPromotion(data);
    },
};
