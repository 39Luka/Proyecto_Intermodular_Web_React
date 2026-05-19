import { MemoryRouter } from "react-router-dom";
import ProductList from "../components/sections/ProductList";
import CardVertical from "../components/cards/CardVertical";

export default {
    title: "Sections/ProductList",
    component: ProductList,
    tags: ["autodocs"],
    decorators: [
        (Story) => (
            <MemoryRouter>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem", maxWidth: "900px" }}>
                    <Story />
                </div>
            </MemoryRouter>
        ),
    ],
    parameters: {
        docs: {
            description: {
                component:
                    "Renderizador iterativo de productos. Reordena la lista colocando automáticamente los productos agotados (stock: 0) al final.",
            },
        },
    },
};

const mockProducts = [
    { id: 1, title: "Croissant Clásico", price: 2.00, stock: 10, image: "/logo-croassantina.svg" },
    { id: 2, title: "Croissant Sin Stock", price: 2.50, stock: 0, image: "/logo-croassantina.svg" },
    { id: 3, title: "Napolitana de Miel", price: 2.20, stock: 5, image: "/logo-croassantina.svg" },
];

/** Lista de productos mixtos, mostrando el ordenamiento automático */
export const OrdenamientoAutomatico = {
    args: {
        products: mockProducts,
        page: "catalog",
        CardComponent: CardVertical,
    },
};
