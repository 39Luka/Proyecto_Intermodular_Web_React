import CardVertical from "../components/cards/CardVertical";

/**
 * Tarjeta de producto en disposición vertical.
 *
 * Muestra la imagen del producto en la parte superior con la información debajo.
 * Es el componente principal del catálogo de productos.
 */
export default {
    title: "Cards/CardVertical",
    component: CardVertical,
    tags: ["autodocs"],
    argTypes: {
        id: { control: "number", description: "Identificador único del producto" },
        title: { control: "text", description: "Nombre del producto" },
        image: { control: "text", description: "URL de la imagen del producto" },
        description: { control: "text", description: "Descripción breve" },
        price: { control: "number", description: "Precio en EUR" },
        stock: { control: "number", description: "Unidades disponibles" },
        onNavigate: { action: "onNavigate", description: "Callback al hacer clic" },
    },
    parameters: {
        docs: {
            description: {
                component:
                    "Tarjeta vertical reutilizable para mostrar productos en cuadrículas. Soporta estado agotado, navegación por teclado y fallback de imagen.",
            },
        },
    },
};

/** Estado por defecto con datos completos */
export const Default = {
    args: {
        id: 1,
        title: "Croissant de mantequilla",
        description: "Hojaldre artesanal con mantequilla francesa.",
        price: 2.50,
        stock: 15,
        category: { name: "Bollería" },
        image: "/logo-croassantina.svg",
    },
};

/** Producto sin imagen — usa la imagen fallback */
export const SinImagen = {
    args: {
        ...Default.args,
        id: 2,
        title: "Pan de semillas",
        image: null,
    },
};

/** Producto agotado — muestra ribbon y deshabilita navegación */
export const Agotado = {
    args: {
        ...Default.args,
        id: 3,
        title: "Tarta de manzana",
        stock: 0,
    },
};

/** Sin precio — muestra texto alternativo */
export const SinPrecio = {
    args: {
        ...Default.args,
        id: 4,
        title: "Producto del día",
        price: null,
    },
};
