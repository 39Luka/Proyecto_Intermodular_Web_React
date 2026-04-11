import { apiFetch } from "./api";

const extractData = (data) => Array.isArray(data) ? data : (Array.isArray(data?.content) ? data.content : []);

export const categoryService = {
    getCategories: async () => {
        const data = await apiFetch("/categories", {}, true); // public
        return extractData(data);
    },

    getCategoryById: async (id) => {
        if (!id) throw new Error("Category ID is required");
        const data = await apiFetch(`/categories/${id}`, {}, true); // public
        return data || null;
    },
};
