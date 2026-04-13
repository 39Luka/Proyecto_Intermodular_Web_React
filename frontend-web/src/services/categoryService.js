import { apiFetch } from "./api";

const extractData = (data) => Array.isArray(data) ? data : (Array.isArray(data?.content) ? data.content : []);

export const categoryService = {
    /**
     * Lists all categories. The API requires pageable params (page + size).
     * @param {number} page
     * @param {number} size
     */
    getCategories: async (page = 0, size = 100) => {
        const params = new URLSearchParams({ page, size });
        const data = await apiFetch(`/categories?${params.toString()}`, {}, true); // public
        return extractData(data);
    },

    getCategoryById: async (id) => {
        if (!id) throw new Error("Category ID is required");
        const data = await apiFetch(`/categories/${id}`, {}, true); // public
        return data || null;
    },

    /**
     * Creates a new category. Admin-only.
     * @param {string} name
     */
    createCategory: async (name) => {
        return apiFetch("/categories", {
            method: "POST",
            body: JSON.stringify({ name }),
        });
    },

    /**
     * Updates a category by ID. Admin-only.
     * @param {number} id
     * @param {string} name
     */
    updateCategory: async (id, name) => {
        return apiFetch(`/categories/${id}`, {
            method: "PUT",
            body: JSON.stringify({ name }),
        });
    },
};
