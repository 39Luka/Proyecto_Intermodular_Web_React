import { NavLink } from "react-router-dom";

function Nav() {
    return (
        <>
            <nav className="header__nav" aria-label="main-navigation">
                <NavLink className="button" to="/home">Inicio</NavLink>
                <NavLink className="button" to="/cart">Carrito</NavLink>
                <NavLink className="button" to="/products">Catálogo</NavLink>
                <NavLink className="button" to="/promo">Mis promociones</NavLink>
                <NavLink className="button" to="/purchased">Mis compras</NavLink>
            </nav>
        </>
    )
}

export default Nav;