import Nav from "./Nav.jsx";
import { useAuth } from "../../hooks/useAuth";

function Header() {
  const { logout } = useAuth();

  return (
    <header className="header">
      <div className="header__container">
        <h1 className="header__logo">Mi Logo</h1>
        <Nav />
        <button className="button button--text ml-auto" onClick={logout}>
          Cerrar sesión
        </button>
      </div>
    </header>
  );
}

export default Header;
