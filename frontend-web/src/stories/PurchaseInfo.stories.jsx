import PurchaseInfo from "../components/purchase/PurchaseInfo";

/**
 * Información general de una compra.
 *
 * Muestra fecha, estado, total y acciones de pago/cancelación.
 */
export default {
    title: "Purchase/PurchaseInfo",
    component: PurchaseInfo,
    tags: ["autodocs"],
    argTypes: {
        onPay: { action: "onPay" },
        onCancel: { action: "onCancel" },
    },
    parameters: {
        docs: {
            description: {
                component:
                    "Sección de información general de un pedido. Muestra botones de acción cuando el estado es CREATED.",
            },
        },
    },
};

const mockDetails = [
    { subtotal: 5.00 },
    { subtotal: 3.50 },
    { subtotal: 2.00 },
];

/** Compra pendiente de pago (con botones de acción) */
export const Pendiente = {
    args: {
        purchase: {
            createdAt: "2025-05-15T10:30:00",
            status: "CREATED",
            description: "Estado: Creada",
        },
        details: mockDetails,
    },
};

/** Compra pagada (sin botones de acción) */
export const Pagada = {
    args: {
        purchase: {
            createdAt: "2025-05-15T10:30:00",
            status: "PAID",
            description: "Estado: Pagada",
        },
        details: mockDetails,
    },
};

/** Compra cancelada */
export const Cancelada = {
    args: {
        purchase: {
            createdAt: "2025-05-15T10:30:00",
            status: "CANCELLED",
            description: "Estado: Cancelada",
        },
        details: mockDetails,
    },
};
