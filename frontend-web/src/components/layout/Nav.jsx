import { NavLink } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../hooks/useAuth";

function Nav() {
    const { cartCount } = useCart();
    const { isAdmin } = useAuth();

    return (
        <nav className="header__nav" aria-label="main-navigation">
            <NavLink className="button" to="/home">Inicio</NavLink>
            <NavLink className="button" to="/products">Catalogo</NavLink>
            <NavLink className="button" to="/promo">Promociones</NavLink>
            <NavLink className="button" to="/purchased">Pedidos</NavLink>
            <NavLink className="button" to="/cart">Carrito {cartCount > 0 ? `(${cartCount})` : ""}</NavLink>
            {isAdmin && (
                <NavLink className="button" to="/admin">Gestion</NavLink>
            )}
        </nav>
    );
}

export default Nav;
