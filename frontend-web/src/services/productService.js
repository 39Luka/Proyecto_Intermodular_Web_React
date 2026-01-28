import { apiFetch } from "./api";
import { mapProduct } from "../utils/mappers";

export const productService = {
    getAllProducts: async () => {
        const data = await apiFetch("/productos");
        return Array.isArray(data) ? data.map(mapProduct) : [];
    },

    getProductById: async (id) => {
        if (!id) throw new Error("Product ID is required");
        const data = await apiFetch(`/productos/${id}`);
        return data ? mapProduct(data) : null;
    },
};
