import CartSummary from "../components/cart/CartSummary";

/**
 * Panel de resumen del carrito.
 *
 * Muestra el total de la compra y un botón de finalización.
 */
export default {
    title: "Cart/CartSummary",
    component: CartSummary,
    tags: ["autodocs"],
    argTypes: {
        total: { control: "number", description: "Importe total en EUR" },
        isProcessing: { control: "boolean", description: "Indica si la compra se está procesando" },
        onCheckout: { action: "onCheckout" },
    },
    parameters: {
        docs: {
            description: {
                component:
                    "Panel inferior del carrito que muestra el total y el botón de pago. El botón se deshabilita durante el procesamiento.",
            },
        },
    },
};

/** Estado normal listo para pagar */
export const Default = {
    args: {
        total: 12.50,
        isProcessing: false,
    },
};

/** Durante el procesamiento de la compra */
export const Procesando = {
    args: {
        total: 12.50,
        isProcessing: true,
    },
};

/** Con total cero (carrito vacío) */
export const TotalCero = {
    args: {
        total: 0,
        isProcessing: false,
    },
};
