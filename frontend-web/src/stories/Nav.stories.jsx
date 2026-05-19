import { MemoryRouter } from "react-router-dom";
import Nav from "../components/layout/Nav";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";

export default {
    title: "Layout/Nav",
    component: Nav,
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
                    "Barra de navegación principal. Muestra dinámicamente los enlaces públicos y protegidos, y un badge con la cuenta del carrito.",
            },
        },
    },
};

const createMockProviders = (authState, cartState) => (Story) => (
    <AuthContext.Provider value={authState}>
        <CartContext.Provider value={cartState}>
            <Story />
        </CartContext.Provider>
    </AuthContext.Provider>
);

/** Navegación para un usuario no autenticado (Invitado) */
export const Invitado = {
    decorators: [
        createMockProviders(
            { isAuthenticated: false, isAdmin: false, user: null },
            { cartCount: 0 }
        ),
    ],
};

/** Navegación para un cliente normal autenticado con items en el carrito */
export const ClienteConCarrito = {
    decorators: [
        createMockProviders(
            { isAuthenticated: true, isAdmin: false, user: { name: "Luka" } },
            { cartCount: 3 }
        ),
    ],
};

/** Navegación para un administrador */
export const Administrador = {
    decorators: [
        createMockProviders(
            { isAuthenticated: true, isAdmin: true, user: { name: "Admin" } },
            { cartCount: 0 }
        ),
    ],
};
