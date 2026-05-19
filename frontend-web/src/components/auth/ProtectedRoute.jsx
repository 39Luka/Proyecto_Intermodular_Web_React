import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

/**
 * Componente que protege rutas restringidas a usuarios autenticados.
 * Si el usuario no está logueado, es redirigido al login.
 * 
 * @param {object} props
 * @param {JSX.Element} props.children
 * @returns {JSX.Element} Children o redirección.
 */
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="section-loader-wrap section-loader-wrap--auth">
                <div className="section-spinner" aria-label="Cargando..."></div>
                <p className="section-loader-text">Verificando sesión...</p>
                <p className="section-loader-subtext">Un momento por favor.</p>
            </div>
        );
    }

    if (!isAuthenticated) {
        // Guardamos la ubicación para volver después del login si fuera necesario
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
};

export default ProtectedRoute;
