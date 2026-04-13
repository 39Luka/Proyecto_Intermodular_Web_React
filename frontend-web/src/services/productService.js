import { apiFetch } from "./api";
import { mapProduct } from "../utils/mappers";

// Extrae el array de datos paginados de Spring (data.content) o un array directo
const extractData = (data) => Array.isArray(data) ? data : (Array.isArray(data?.content) ? data.content : []);

export const productService = {
    /**
     * Lists all products. The API requires pageable params (page + size).
     * @param {number|null} categoryId - Optional category filter.
     * @param {number} page - Page number (0-indexed).
     * @param {number} size - Page size.
     */
    getAllProducts: async (categoryId = null, page = 0, size = 100) => {
        const params = new URLSearchParams({ page, size });
        if (categoryId) params.set("categoryId", categoryId);
        const data = await apiFetch(`/products?${params.toString()}`, {}, true); // public
        return extractData(data).map(mapProduct);
    },

    getProductById: async (id) => {
        if (!id) throw new Error("Product ID is required");
        const data = await apiFetch(`/products/${id}`, {}, true); // public
        return data ? mapProduct(data) : null;
    },

    /**
     * Returns the top selling products (from PAID purchases).
     * @param {number} page
     * @param {number} size
     */
    getTopSelling: async (page = 0, size = 10) => {
        const params = new URLSearchParams({ page, size });
        const data = await apiFetch(`/products/top-selling?${params.toString()}`, {}, true); // public
        return extractData(data).map(mapProduct);
    },

    /**
     * Admin-only: Creates a new product.
     * @param {{ name, description, price, stock, imageUrl, categoryId }} payload
     */
    createProduct: async (payload) => {
        const data = await apiFetch("/products", {
            method: "POST",
            body: JSON.stringify(payload),
        });
        return data ? mapProduct(data) : null;
    },

    /**
     * Admin-only: Updates an existing product.
     * @param {number} id
     * @param {object} payload
     */
    updateProduct: async (id, payload) => {
        const data = await apiFetch(`/products/${id}`, {
            method: "PUT",
            body: JSON.stringify(payload),
        });
        return data ? mapProduct(data) : null;
    },

    /**
     * Admin-only: Deletes a product.
     * @param {number} id
     */
    deleteProduct: async (id) => {
        await apiFetch(`/products/${id}`, { method: "DELETE" });
    },
};
