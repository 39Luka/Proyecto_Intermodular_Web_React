import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

/**
 * Componente que protege rutas restringidas a administradores.
 * Si el usuario no es admin, es redirigido a la página de inicio.
 * 
 * @returns {JSX.Element} El contenido de la ruta o una redirección.
 */
const AdminRoute = () => {
    const { user, isAdmin, loading } = useAuth();

    if (loading) {
        return <div className="full-page-loader">Cargando verificación de administrador...</div>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (!isAdmin) {
        console.warn("Acceso denegado: Se requiere rol ADMIN");
        return <Navigate to="/home" replace />;
    }

    return <Outlet />;
};

export default AdminRoute;
