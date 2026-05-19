import { NavLink } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../hooks/useAuth";

/**
 * Barra de navegación principal de la aplicación.
 *
 * Renderiza los enlaces de navegación accesibles a todos los usuarios
 * (Inicio, Catálogo, Promociones, Pedidos, Carrito) y, de forma condicional,
 * el enlace de administración cuando el usuario tiene rol ADMIN.
 *
 * El enlace al carrito muestra un badge con el número de artículos cuando el
 * usuario está autenticado y el carrito no está vacío.
 *
 * @component
 * @returns {JSX.Element} Elemento `<nav>` con los enlaces de navegación.
 *
 * @example
 * // Se usa internamente dentro de Header; no necesita props
 * <Nav />
 */
function Nav() {
    const { cartCount } = useCart();
    const { isAdmin, isAuthenticated } = useAuth();

    return (
        <nav className="header__nav" aria-label="main-navigation">
            <NavLink className="button" to="/home">Inicio</NavLink>
            <NavLink className="button" to="/products">Catálogo</NavLink>
            <NavLink className="button" to="/promo">Promociones</NavLink>
            <NavLink className="button" to="/purchased">Pedidos</NavLink>
            <NavLink className="button" to="/cart">Carrito {isAuthenticated && cartCount > 0 ? `(${cartCount})` : ""}</NavLink>
            {isAdmin && (
                <NavLink className="button" to="/admin">Gestión</NavLink>
            )}
        </nav>
    );
}

export default Nav;
