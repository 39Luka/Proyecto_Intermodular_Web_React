/**
 * @fileoverview Servicio REST para categorías de productos.
 *
 * Todas las operaciones de lectura son públicas (skipAuth=true).
 * Las operaciones de escritura (crear, actualizar) requieren rol ADMIN.
 *
 * @module categoryService
 */
import { apiFetch } from "./api";

/** @private Extrae el array de items de una respuesta paginada de Spring o de un array directo. */
const extractData = (data) => Array.isArray(data) ? data : (Array.isArray(data?.content) ? data.content : []);

export const categoryService = {
    /**
     * Lista todas las categorías. La API requiere parámetros de paginación (page y size).
     *
     * @param {number} page - Número de página.
     * @param {number} size - Tamaño de página.
     * @returns {Promise<Array>}
     */
    getCategories: async (page = 0, size = 100) => {
        const params = new URLSearchParams({ page, size });
        const data = await apiFetch(`/categories?${params.toString()}`, {}, true); // public
        return extractData(data);
    },

    getCategoryById: async (id) => {
        if (!id) throw new Error("El ID de la categoría es requerido");
        const data = await apiFetch(`/categories/${id}`, {}, true); // público
        return data || null;
    },

    /**
     * Solo Admin: Crea una nueva categoría.
     *
     * @param {string} name - Nombre de la nueva categoría.
     * @returns {Promise<Object>}
     */
    createCategory: async (name) => {
        return apiFetch("/categories", {
            method: "POST",
            body: JSON.stringify({ name }),
        });
    },

    /**
     * Solo Admin: Actualiza el nombre de una categoría por su ID.
     *
     * @param {number} id - ID de la categoría a actualizar.
     * @param {string} name - Nuevo nombre.
     * @returns {Promise<Object>}
     */
    updateCategory: async (id, name) => {
        return apiFetch(`/categories/${id}`, {
            method: "PUT",
            body: JSON.stringify({ name }),
        });
    },
};
