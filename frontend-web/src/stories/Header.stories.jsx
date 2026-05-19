import { MemoryRouter } from "react-router-dom";
import Header from "../components/layout/Header";
import { AuthContext } from "../context/AuthContext";
import { SearchContext } from "../context/SearchContext";
import { CartContext } from "../context/CartContext";

export default {
    title: "Layout/Header",
    component: Header,
    tags: ["autodocs"],
    parameters: {
        docs: {
            description: {
                component:
                    "Cabecera dinámica de la aplicación. Adapta sus controles (búsqueda de texto, filtros de fecha, botón/avatar) según la ruta y estado de autenticación.",
            },
        },
    },
};

const createHeaderDecorator = (initialEntries = ["/"], authUser = null, searchState = {}) => {
    const defaultSearch = {
        searchTerm: "",
        setSearchTerm: () => {},
        startDate: "",
        setStartDate: () => {},
        endDate: "",
        setEndDate: () => {},
        appliedDates: { start: null, end: null },
        setAppliedDates: () => {},
        loading: false,
        ...searchState,
    };

    return (Story) => (
        <MemoryRouter initialEntries={initialEntries}>
            <AuthContext.Provider value={{ user: authUser, isAuthenticated: !!authUser, loading: false }}>
                <SearchContext.Provider value={defaultSearch}>
                    <CartContext.Provider value={{ cartCount: 2 }}>
                        <Story />
                    </CartContext.Provider>
                </SearchContext.Provider>
            </AuthContext.Provider>
        </MemoryRouter>
    );
};

/** Cabecera por defecto para invitados (sin autenticar) en la Home */
export const InvitadoHome = {
    decorators: [
        createHeaderDecorator(["/home"], null),
    ],
};

/** Cabecera para cliente en catálogo de productos (con barra de búsqueda activa) */
export const ClienteCatalogoConBusqueda = {
    decorators: [
        createHeaderDecorator(["/products"], { name: "Luka", email: "luka@rm.es" }, { searchTerm: "Croissant" }),
    ],
};

/** Cabecera en la sección de mis pedidos (con formulario de rango de fechas) */
export const ClientePedidosConFechas = {
    decorators: [
        createHeaderDecorator(["/purchased"], { name: "Luka", email: "luka@rm.es" }, { startDate: "2025-05-01", endDate: "2025-05-31" }),
    ],
};
