import PurchaseLines from "../components/purchase/PurchaseLines";

/**
 * Lista de productos incluidos en una compra.
 *
 * Renderiza tarjetas horizontales con los detalles de cada línea del pedido.
 */
export default {
    title: "Purchase/PurchaseLines",
    component: PurchaseLines,
    tags: ["autodocs"],
    argTypes: {
        onNavigate: { action: "onNavigate" },
    },
    parameters: {
        docs: {
            description: {
                component:
                    "Sección con las líneas de una compra. Cada línea se muestra como una `CardHorizontal` con cantidad, precio unitario y subtotal.",
            },
        },
    },
};

const mockProductsMap = {
    1: { description: "Hojaldre artesanal con mantequilla francesa", image: "/logo-croassantina.svg" },
    2: { description: "Pan de masa madre con semillas de girasol", image: "/logo-croassantina.svg" },
};

/** Compra con varias líneas */
export const ConLineas = {
    args: {
        details: [
            { productId: 1, title: "Croissant de mantequilla", quantity: 3, subtotal: 7.50 },
            { productId: 2, title: "Pan de semillas", quantity: 1, subtotal: 3.20 },
        ],
        productsMap: mockProductsMap,
    },
};

/** Compra sin líneas (estado vacío) */
export const SinLineas = {
    args: {
        details: [],
        productsMap: {},
    },
};
