import { NavLink } from "react-router-dom";
import { useCart } from "../../context/CartContext";

function Nav() {
    const { cartCount } = useCart();
    return (
        <>
            <nav className="header__nav" aria-label="main-navigation">
                <NavLink className="button" to="/home">Inicio</NavLink>
                <NavLink className="button" to="/cart">
                    Carrito {cartCount > 0 && `(${cartCount})`}
                </NavLink>
                <NavLink className="button" to="/products">Catálogo</NavLink>
                <NavLink className="button" to="/promo">Mis promociones</NavLink>
                <NavLink className="button" to="/purchased">Mis compras</NavLink>
            </nav>
        </>
    )
}

export default Nav;