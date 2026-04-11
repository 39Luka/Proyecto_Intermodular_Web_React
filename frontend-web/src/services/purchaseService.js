import { apiFetch } from "./api";
import { mapPurchase } from "../utils/mappers";

const extractData = (data) => Array.isArray(data) ? data : (Array.isArray(data?.content) ? data.content : []);

export const purchaseService = {
    // GET /purchases — my purchases (auth required)
    getAllPurchases: async () => {
        const data = await apiFetch("/purchases");
        return extractData(data).map(mapPurchase);
    },

    // GET /purchases/{id}
    getPurchaseById: async (id) => {
        const data = await apiFetch(`/purchases/${id}`);
        if (!data) return null;
        return mapPurchase(data);
    },

    // POST /purchases — create a new purchase
    // items: [{ productId, quantity }]
    createPurchase: async (items) => {
        const data = await apiFetch("/purchases", {
            method: "POST",
            body: JSON.stringify({ items }),
        });
        return data ? mapPurchase(data) : null;
    },

    // PATCH /purchases/{id}/pay
    payPurchase: async (id) => {
        const data = await apiFetch(`/purchases/${id}/pay`, {
            method: "PATCH",
        });
        return data ? mapPurchase(data) : null;
    },

    // PATCH /purchases/{id}/cancel
    cancelPurchase: async (id) => {
        const data = await apiFetch(`/purchases/${id}/cancel`, {
            method: "PATCH",
        });
        return data ? mapPurchase(data) : null;
    },
};
