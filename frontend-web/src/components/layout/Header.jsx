import { Link, useLocation } from "react-router-dom";
import Nav from "./Nav.jsx";
import { useAuth } from "../../hooks/useAuth";
import { useSearch } from "../../context/SearchContext";
import BrandLogo from "./BrandLogo.jsx";
import UserAvatar from "./UserAvatar.jsx";

/**
 * Cabecera global de la aplicación.
 *
 * Renderiza el logotipo de la marca, el título "La Croassantina", el componente de navegación
 * y el botón de inicio de sesión o avatar del usuario.
 * Adicionalmente, incluye barras de búsqueda y filtros de fecha contextuales según la página actual
 * (productos, promociones o historial de pedidos).
 *
 * @component
 * @returns {JSX.Element} Elemento `<header>` con logo, navegación y filtros de búsqueda integrados.
 *
 * @example
 * <Header />
 */
function Header() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const { 
    searchTerm, setSearchTerm, 
    startDate, setStartDate, 
    endDate, setEndDate, 
    appliedDates, setAppliedDates
  } = useSearch();

  const isProducts = location.pathname === "/products";
  const isPromo = location.pathname === "/promo";
  const isPurchased = location.pathname === "/purchased";

  const handleDateSubmit = (e) => {
    e.preventDefault();
    setAppliedDates({
      start: startDate || null,
      end: endDate || null
    });
  };

  const handleDateClear = () => {
    setStartDate("");
    setEndDate("");
    setAppliedDates({
      start: null,
      end: null
    });
  };

  const showSearch = isProducts || isPromo || isPurchased;

  return (
    <header className="header">
      <div className={`header__container ${showSearch ? "header__container--with-search" : ""}`}>
        <Link className="header__logo" to="/home" aria-label="Ir al inicio de La Croassantina">
          <BrandLogo className="header__brand-mark" />
          <span className="header__brand-copy">
            <span className="header__brand-title">La Croassantina</span>
            <span className="header__brand-subtitle">Bakery atelier and daily treats</span>
          </span>
        </Link>

        <Nav />

        {isAuthenticated ? (
          <UserAvatar />
        ) : (
          <Link className="button button--primary" to="/login">
            Entrar
          </Link>
        )}

        {/* Filtro dinámico de búsqueda/fecha: Colocado al final para alinearse perfectamente con la fila 2 */}
        {(isProducts || isPromo) && (
          <div className="header__search-bar">
            <svg className="search-icon-svg" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.2} stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.603 10.603Z" />
            </svg>
            <input
              type="text"
              className="search-input"
              placeholder={isProducts ? "Buscar productos por nombre..." : "Buscar promociones por nombre o descripción..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label={isProducts ? "Buscar productos por nombre" : "Buscar promociones"}
            />
            {searchTerm && (
              <button
                type="button"
                className="search-clear"
                onClick={() => setSearchTerm("")}
                aria-label="Limpiar búsqueda"
              >
                <svg className="search-clear-svg" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.8} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        )}

        {isPurchased && (
          <form onSubmit={handleDateSubmit} className="header__date-form">
            <div className="header__date-group">
              <span className="header__date-label">Desde:</span>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="header__date-input"
                aria-label="Fecha de inicio"
              />
            </div>
            <span className="search-date-separator">hasta</span>
            <div className="header__date-group">
              <span className="header__date-label">Hasta:</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="header__date-input"
                aria-label="Fecha de fin"
              />
            </div>
            <div className="search-date-buttons">
              <button type="submit" className="button button--primary header__date-btn">
                Filtrar
              </button>
              {(startDate || endDate || appliedDates.start || appliedDates.end) && (
                <button type="button" onClick={handleDateClear} className="button button--secondary header__date-btn">
                  Limpiar
                </button>
              )}
            </div>
          </form>
        )}
      </div>
    </header>
  );
}

export default Header;
