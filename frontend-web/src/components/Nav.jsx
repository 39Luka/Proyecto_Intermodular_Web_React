import { NavLink } from "react-router-dom";

function Nav(){
    return(
        <>
            <nav aria-label="main-navigation">
                <NavLink to="/home">Inicio</NavLink>
                <NavLink to="/cart">Carrito</NavLink>
                <NavLink to="/products">Catálogo</NavLink>
                <NavLink to="/promo">Mis promociones</NavLink>
                <NavLink to="/purchased">Mis compras</NavLink>
            </nav>
        </>
    )
}

export default Nav;