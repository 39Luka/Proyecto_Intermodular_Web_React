/**
 * @fileoverview Servicio REST para productos de la tienda.
 *
 * Operaciones de lectura (listado, detalle, top-selling) son públicas.
 * Operaciones de escritura (crear, actualizar, parchear) requieren rol ADMIN.
 * Todas las respuestas pasan por `mapProduct` y se enriquecen con la categoría.
 *
 * @module productService
 */
import { apiFetch } from "./api";
import { categoryService } from "./categoryService";
import { mapProduct } from "../utils/mappers";

// Extrae el array de datos paginados de Spring (data.content) o un array directo
const extractData = (data) => Array.isArray(data) ? data : (Array.isArray(data?.content) ? data.content : []);

let categoriesPromise = null;

async function getCategoriesMap() {
    if (!categoriesPromise) {
        categoriesPromise = categoryService.getCategories()
            .catch((error) => {
                categoriesPromise = null;
                throw error;
            });
    }

    const categories = await categoriesPromise;
    return new Map(categories.map((category) => [Number(category.id), category]));
}

async function enrichProductCategory(product) {
    if (!product) return null;
    if (product.category?.name) return product;

    const categoryId = Number(product.categoryId ?? product.category?.id);
    if (!categoryId) return product;

    try {
        const categoriesMap = await getCategoriesMap();
        const category = categoriesMap.get(categoryId);
        return category ? { ...product, categoryId, category } : product;
    } catch {
        return product;
    }
}

export const productService = {
    /**
     * Lista todos los productos con soporte de filtros (categoría, nombre) y paginación.
     * La API requiere parámetros de paginación (page y size).
     *
     * @param {number|null} categoryId - Filtro opcional por ID de categoría.
     * @param {number} page - Número de página (comienza en 0).
     * @param {number} size - Tamaño de página.
     * @param {string|null} name - Filtro opcional para buscar por coincidencia parcial de nombre.
     * @param {string|null} sortBy - Campo por el cual ordenar.
     * @param {string|null} order - Dirección del ordenamiento ("asc" o "desc").
     * @returns {Promise<{ products: Array, totalPages: number, totalElements: number, currentPage: number }>}
     */
    getAllProducts: async (categoryId = null, page = 0, size = 12, name = null, sortBy = null, order = null) => {
        const params = new URLSearchParams({ page, size });
        if (categoryId) params.set("categoryId", categoryId);
        if (name) params.set("name", name);
        if (sortBy) params.set("sortBy", sortBy);
        if (order) params.set("order", order);
        const data = await apiFetch(`/products?${params.toString()}`, {}, true); // public
        const rawList = extractData(data).map(mapProduct);
        const products = await Promise.all(rawList.map(enrichProductCategory));
        return {
            products,
            totalPages: data?.totalPages ?? 1,
            totalElements: data?.totalElements ?? products.length,
            currentPage: data?.number ?? page,
        };
    },

    getProductById: async (id) => {
        if (!id) throw new Error("El ID del producto es requerido");
        const data = await apiFetch(`/products/${id}`, {}, true); // público
        return data ? enrichProductCategory(mapProduct(data)) : null;
    },

    /**
     * Obtiene los productos más vendidos (basado en compras en estado PAID).
     * Si existen menos productos más vendidos que el tamaño `size`, rellena los
     * huecos restantes con productos regulares para asegurar que la sección de la Home siempre tenga contenido.
     *
     * @param {number} page - Número de página.
     * @param {number} size - Cantidad de productos a recuperar.
     * @returns {Promise<Array>} Listado de productos enriquecidos.
     */
    getTopSelling: async (page = 0, size = 6) => {
        const params = new URLSearchParams({ page, size });
        const data = await apiFetch(`/products/top-selling?${params.toString()}`, {}, true); // public
        const topSellingEntries = extractData(data);

        // Obtener cada producto más vendido por su ID
        const productResults = await Promise.allSettled(
            topSellingEntries.map((entry) => productService.getProductById(entry.productId))
        );

        const topProducts = productResults
            .filter((result) => result.status === "fulfilled" && result.value)
            .map((result) => result.value);

        // Si obtuvimos menos productos de los solicitados, rellenamos con productos regulares
        if (topProducts.length < size) {
            try {
                const topIds = new Set(topProducts.map((p) => p.id));
                const { products: allProducts } = await productService.getAllProducts(null, 0, size * 2);
                const extras = allProducts
                    .filter((p) => !topIds.has(p.id))
                    .slice(0, size - topProducts.length);
                return [...topProducts, ...extras];
            } catch {
                // Si la recuperación de respaldo falla, retornamos los que tenemos
            }
        }

        return topProducts;
    },

    /**
     * Solo Admin: Crea un nuevo producto.
     *
     * @param {{ name: string, description: string, price: number, stock: number, imageUrl: string, categoryId: number }} payload - Datos del producto.
     * @returns {Promise<Object|null>} El producto creado o null si falla.
     */
    createProduct: async (payload) => {
        const data = await apiFetch("/products", {
            method: "POST",
            body: JSON.stringify(payload),
        });
        return data ? mapProduct(data) : null;
    },

    /**
     * Solo Admin: Actualiza un producto existente.
     *
     * @param {number} id - ID del producto a actualizar.
     * @param {object} payload - Nuevos datos del producto.
     * @returns {Promise<Object|null>} El producto actualizado o null.
     */
    updateProduct: async (id, payload) => {
        const data = await apiFetch(`/products/${id}`, {
            method: "PUT",
            body: JSON.stringify(payload),
        });
        return data ? mapProduct(data) : null;
    },

    /**
     * Solo Admin: Modifica el estado activo de un producto (borrado lógico).
     *
     * @param {number} id - ID del producto.
     * @param {boolean} active - Estado de activación.
     */
    patchProduct: async (id, active) => {
        await apiFetch(`/products/${id}`, { method: "PATCH", body: JSON.stringify({ active }) });
    },
};
