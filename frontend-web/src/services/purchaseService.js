import { apiFetch } from "./api";
import { mapPurchase } from "../utils/mappers";

export const purchaseService = {
    getAllPurchases: async () => {
        const data = await apiFetch("/compras");
        return (data || []).map(mapPurchase);
    },

    getPurchaseById: async (id) => {
        const data = await apiFetch(`/compras/${id}`);
        if (!data) return null;
        return mapPurchase(data);
    },

    getAllPurchaseDetails: async () => {
        const data = await apiFetch("/detalle-compras");
        // Si más adelante tenemos un mapper para los detalles, podemos aplicarlo aquí
        return data || [];
    }
};
