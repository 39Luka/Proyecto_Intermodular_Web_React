import { MemoryRouter } from "react-router-dom";
import ProductSection from "../components/sections/ProductSection";
import CardVertical from "../components/cards/CardVertical";

export default {
    title: "Sections/ProductSection",
    component: ProductSection,
    tags: ["autodocs"],
    decorators: [
        (Story) => (
            <MemoryRouter>
                <Story />
            </MemoryRouter>
        ),
    ],
    parameters: {
        docs: {
            description: {
                component:
                    "Sección de productos unificada. Gestiona estados de carga, spinner de carga, errores con timeout de red y estado vacío de catálogo.",
            },
        },
    },
};

const mockProducts = [
    { id: 1, title: "Croissant Relleno", price: 2.90, stock: 12, image: "/logo-croassantina.svg" },
    { id: 2, title: "Palmera de Chocolate", price: 3.10, stock: 8, image: "/logo-croassantina.svg" },
];

/** Carga completa con productos */
export const Completado = {
    args: {
        title: "Recomendados de la semana",
        products: mockProducts,
        CardComponent: CardVertical,
        loading: false,
        error: null,
    },
};

/** Estado de carga activo (muestra un spinner centrado) */
export const Cargando = {
    args: {
        ...Completado.args,
        products: [],
        loading: true,
    },
};

/** Error de carga por fallo de red o timeout */
export const ErrorDeCarga = {
    args: {
        ...Completado.args,
        products: [],
        loading: false,
        error: "No se pudo establecer conexión con el servidor. Reintentando...",
    },
};

/** Sin productos (Catálogo vacío) */
export const Vacio = {
    args: {
        ...Completado.args,
        products: [],
        loading: false,
        error: null,
        emptyTitle: "No hay productos disponibles",
        emptyDescription: "Vuelve a consultar más tarde para ver nuestras novedades de panadería.",
    },
};
