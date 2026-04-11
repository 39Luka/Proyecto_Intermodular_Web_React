import { apiFetch } from "./api";
import { mapProduct } from "../utils/mappers";

// Extrae el array de datos, ya sea directo o en data.content (paginado de Spring)
const extractData = (data) => Array.isArray(data) ? data : (Array.isArray(data?.content) ? data.content : []);

export const productService = {
    getAllProducts: async (categoryId = null) => {
        const query = categoryId ? `?categoryId=${categoryId}` : "";
        const data = await apiFetch(`/products${query}`, {}, true); // public
        return extractData(data).map(mapProduct);
    },

    getProductById: async (id) => {
        if (!id) throw new Error("Product ID is required");
        const data = await apiFetch(`/products/${id}`, {}, true); // public
        return data ? mapProduct(data) : null;
    },

    getTopSelling: async () => {
        const data = await apiFetch("/products/top-selling", {}, true); // public
        return extractData(data).map(mapProduct);
    },
};
