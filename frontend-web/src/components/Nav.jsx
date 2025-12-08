import { NavLink } from "react-router-dom";

function Nav(){
    return(
        <>
            <nav aria-label="main-navigation">
                <NavLink className="boton" to="/home">Inicio</NavLink>
                <NavLink className="boton"to="/cart">Carrito</NavLink>
                <NavLink  className="boton"to="/products">Catálogo</NavLink>
                <NavLink  className="boton"to="/promo">Mis promociones</NavLink>
                <NavLink  className="boton"to="/purchased">Mis compras</NavLink>
            </nav>
        </>
    )
}

export default Nav;