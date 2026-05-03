import { apiFetch } from "./api";
import { mapPurchase } from "../utils/mappers";

const extractData = (data) => Array.isArray(data) ? data : (Array.isArray(data?.content) ? data.content : []);

export const purchaseService = {
    /**
     * Lists purchases. Admins can filter by userId; regular users see their own.
     * The API requires pageable params (page + size).
     * @param {number} page
     * @param {number} size
     * @param {number|null} userId - Admin-only filter
     */
    getAllPurchases: async (page = 0, size = 50, userId = null) => {
        const params = new URLSearchParams({ page, size });
        if (userId) params.set("userId", userId);
        const data = await apiFetch(`/purchases?${params.toString()}`);
        return extractData(data).map(mapPurchase);
    },

    // GET /purchases/{id}
    getPurchaseById: async (id) => {
        const data = await apiFetch(`/purchases/${id}`);
        if (!data) return null;
        return mapPurchase(data);
    },

    /**
     * Creates a new purchase. Decreases stock and optionally applies a promotion.
     * @param {Array<{productId: number, quantity: number, promotionId?: number}>} items
     * @param {number|null} userId - Required when the caller is ADMIN; ignored for regular users.
     */
    createPurchase: async (items, userId = null) => {
        const body = { items };
        // The backend mandates userId for ADMIN callers; harmless for regular users.
        if (userId !== null && userId !== undefined) body.userId = userId;
        const data = await apiFetch("/purchases", {
            method: "POST",
            body: JSON.stringify(body),
        });
        return data ? mapPurchase(data) : null;
    },

    /**
     * Marks a purchase as PAID. Returns 204 No Content.
     * Only the owner or admin can pay a CREATED purchase.
     * @param {number} id
     */
    payPurchase: async (id) => {
        // Returns 204 No Content — no body to map
        await apiFetch(`/purchases/${id}/pay`, { method: "PATCH" });
    },

    /**
     * Cancels a purchase. Restores stock and releases promotion usage. Returns 204.
     * Only the owner or admin can cancel a CREATED purchase.
     * @param {number} id
     */
    cancelPurchase: async (id) => {
        // Returns 204 No Content — no body to map
        await apiFetch(`/purchases/${id}/cancel`, { method: "PATCH" });
    },
};
