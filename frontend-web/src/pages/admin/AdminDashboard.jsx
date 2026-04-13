import { Link } from "react-router-dom";

/**
 * AdminDashboard - Página principal de administración.
 * Ofrece una visión general y accesos rápidos a los diferentes módulos de gestión.
 */
function AdminDashboard() {
    const adminModules = [
        {
            title: "Productos",
            description: "Gestionar el catálogo, stock y precios.",
            path: "/admin/products",
            icon: "🥖"
        },
        {
            title: "Categorías",
            description: "Organizar productos por tipos.",
            path: "/admin/categories",
            icon: "📁"
        },
        {
            title: "Promociones",
            description: "Gestionar descuentos y ofertas activas.",
            path: "/admin/promotions",
            icon: "🏷️"
        },
        {
            title: "Usuarios",
            description: "Administrar cuentas y permisos.",
            path: "/admin/users",
            icon: "👥"
        }
    ];

    return (
        <div className="admin-dashboard">
            <header className="admin-header">
                <h1>Panel de Gestión</h1>
                <p>Bienvenido al obrador central. Selecciona un área para comenzar.</p>
            </header>

            <div className="admin-grid">
                {adminModules.map((module) => (
                    <Link to={module.path} key={module.path} className="admin-card">
                        <span className="admin-card__icon">{module.icon}</span>
                        <div className="admin-card__content">
                            <h3>{module.title}</h3>
                            <p>{module.description}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default AdminDashboard;
