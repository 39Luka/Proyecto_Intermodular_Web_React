import { Link } from "react-router-dom";
import Nav from "./Nav.jsx";
import { useAuth } from "../../hooks/useAuth";

function Header() {
  const { isAuthenticated, logout } = useAuth();

  return (
    <header className="header">
      <div className="header__container">
        <Link className="header__logo" to="/home" aria-label="Ir al inicio de La Croassantina">
          <span className="header__brand-mark">LC</span>
          <span className="header__brand-copy">
            <span className="header__brand-title">La Croassantina</span>
            <span className="header__brand-subtitle">Bakery atelier and daily treats</span>
          </span>
        </Link>

        <Nav />

        {isAuthenticated ? (
          <button className="button button--secondary" onClick={logout}>
            Cerrar sesion
          </button>
        ) : (
          <Link className="button button--primary" to="/login">
            Entrar
          </Link>
        )}
      </div>
    </header>
  );
}

export default Header;
