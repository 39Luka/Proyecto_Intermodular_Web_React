import Pagination from "../components/ui/Pagination";

/**
 * Barra de paginación con botones anterior/siguiente.
 *
 * Muestra un indicador "Página X de Y" con flechas de navegación.
 */
export default {
    title: "UI/Pagination",
    component: Pagination,
    tags: ["autodocs"],
    argTypes: {
        currentPage: { control: "number", description: "Página actual (base 0)" },
        totalPages: { control: "number", description: "Total de páginas" },
        onPageChange: { action: "onPageChange" },
    },
    parameters: {
        docs: {
            description: {
                component:
                    "Componente de paginación reutilizable. Los botones se deshabilitan automáticamente en los extremos.",
            },
        },
    },
};

/** Primera página de varias */
export const PrimeraPagina = {
    args: {
        currentPage: 0,
        totalPages: 5,
    },
};

/** Página intermedia */
export const PaginaIntermedia = {
    args: {
        currentPage: 2,
        totalPages: 5,
    },
};

/** Última página */
export const UltimaPagina = {
    args: {
        currentPage: 4,
        totalPages: 5,
    },
};

/** Página única (botones deshabilitados) */
export const PaginaUnica = {
    args: {
        currentPage: 0,
        totalPages: 1,
    },
};
