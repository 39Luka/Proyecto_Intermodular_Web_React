import ProductActionCard from "../components/product/ProductActionCard";

/**
 * Panel de acciones en el detalle de producto.
 *
 * Muestra precio, stock, selector de cantidad y botón de compra.
 */
export default {
    title: "Product/ProductActionCard",
    component: ProductActionCard,
    tags: ["autodocs"],
    argTypes: {
        onAddToCart: { action: "onAddToCart" },
    },
    parameters: {
        docs: {
            description: {
                component:
                    "Panel lateral del detalle de producto. Permite seleccionar cantidad y añadir al carrito. Se deshabilita cuando el stock es 0.",
            },
        },
    },
};

/** Producto con stock disponible */
export const ConStock = {
    args: {
        product: {
            price: 3.50,
            stock: 25,
            category: { name: "Bollería" },
        },
    },
};

/** Producto agotado */
export const Agotado = {
    args: {
        product: {
            price: 3.50,
            stock: 0,
            category: { name: "Bollería" },
        },
    },
};

/** Stock bajo (1 unidad) */
export const StockBajo = {
    args: {
        product: {
            price: 8.90,
            stock: 1,
            category: { name: "Tartas" },
        },
    },
};
