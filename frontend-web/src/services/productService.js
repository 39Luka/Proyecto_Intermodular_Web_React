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
     * Lists all products. The API requires pageable params (page + size).
     * @param {number|null} categoryId - Optional category filter.
     * @param {number} page - Page number (0-indexed).
     * @param {number} size - Page size.
     */
    /**
     * Lists products with full pagination metadata.
     * Returns { products, totalPages, totalElements, currentPage }
     */
    getAllProducts: async (categoryId = null, page = 0, size = 12) => {
        const params = new URLSearchParams({ page, size });
        if (categoryId) params.set("categoryId", categoryId);
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
        if (!id) throw new Error("Product ID is required");
        const data = await apiFetch(`/products/${id}`, {}, true); // public
        return data ? enrichProductCategory(mapProduct(data)) : null;
    },

    /**
     * Returns the top selling products (from PAID purchases).
     * If fewer than `size` top-selling products exist, fills the remaining
     * slots with regular products so the home section always has content.
     * @param {number} page
     * @param {number} size
     */
    getTopSelling: async (page = 0, size = 6) => {
        const params = new URLSearchParams({ page, size });
        const data = await apiFetch(`/products/top-selling?${params.toString()}`, {}, true); // public
        const topSellingEntries = extractData(data);

        // Fetch each top-selling product by its ID
        const productResults = await Promise.allSettled(
            topSellingEntries.map((entry) => productService.getProductById(entry.productId))
        );

        const topProducts = productResults
            .filter((result) => result.status === "fulfilled" && result.value)
            .map((result) => result.value);

        // If we got fewer products than requested, pad with regular products
        if (topProducts.length < size) {
            try {
                const topIds = new Set(topProducts.map((p) => p.id));
                const { products: allProducts } = await productService.getAllProducts(null, 0, size * 2);
                const extras = allProducts
                    .filter((p) => !topIds.has(p.id))
                    .slice(0, size - topProducts.length);
                return [...topProducts, ...extras];
            } catch {
                // If fallback fails, return what we have
            }
        }

        return topProducts;
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
    patchProduct: async (id, active) => {
        await apiFetch(`/products/${id}`, { method: "PATCH", body: JSON.stringify({ active }) });
    },
};
