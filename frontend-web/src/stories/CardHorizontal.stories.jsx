import CardHorizontal from "../components/cards/CardHorizontal";

/**
 * Tarjeta de producto en disposición horizontal.
 *
 * Texto a la izquierda e imagen a la derecha. Se usa en el carrito,
 * detalle de compra y listados de promociones.
 */
export default {
    title: "Cards/CardHorizontal",
    component: CardHorizontal,
    tags: ["autodocs"],
    argTypes: {
        id: { control: "number" },
        title: { control: "text" },
        image: { control: "text" },
        description: { control: "text" },
        price: { control: "number" },
        stock: { control: "number" },
        detailLeft: { control: "text" },
        detailRight: { control: "text" },
        className: { control: "text" },
        onNavigate: { action: "onNavigate" },
    },
    parameters: {
        docs: {
            description: {
                component:
                    "Tarjeta horizontal reutilizable. Soporta slot de acciones, estado agotado y navegación por teclado.",
            },
        },
    },
};

/** Estado por defecto con navegación activa */
export const Default = {
    args: {
        id: 1,
        title: "Napolitana de chocolate",
        description: "Masa hojaldrada rellena de chocolate belga.",
        price: 1.80,
        stock: 20,
        category: { name: "Bollería" },
        image: "/logo-croassantina.svg",
    },
};

/** Con detalles personalizados */
export const ConDetallesPersonalizados = {
    args: {
        ...Default.args,
        id: 2,
        detailLeft: "Precio base 1.80 EUR",
        detailRight: "Subtotal 3.60 EUR",
    },
};

/** Tarjeta agotada */
export const Agotado = {
    args: {
        ...Default.args,
        id: 3,
        title: "Ensaimada premium",
        stock: 0,
    },
};

/** Tarjeta estática (sin onNavigate) */
export const Estatica = {
    args: {
        ...Default.args,
        id: 4,
        onNavigate: undefined,
    },
};

/** Con slot de acciones de admin */
export const ConAcciones = {
    args: {
        ...Default.args,
        id: 5,
        actions: (
            <>
                <button className="button button--primary" style={{ fontSize: "0.75rem", padding: "4px 8px" }}>Editar</button>
                <button className="button button--secondary" style={{ fontSize: "0.75rem", padding: "4px 8px" }}>Eliminar</button>
            </>
        ),
    },
};
