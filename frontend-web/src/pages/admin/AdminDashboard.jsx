import { Link } from "react-router-dom";

const adminModules = [
    {
        title: "Productos",
        description: "Gestiona catálogo, stock y precios.",
        path: "/admin/products",
    },
    {
        title: "Categorías",
        description: "Organiza tus productos por tipo.",
        path: "/admin/categories",
    },
    {
        title: "Promociones",
        description: "Crea ofertas y activa o desactiva campañas.",
        path: "/admin/promotions",
    },
    {
        title: "Usuarios",
        description: "Busca cuentas y cambia su estado.",
        path: "/admin/users",
    },
    {
        title: "Ventas",
        description: "Revisa todas las compras y filtra por usuario.",
        path: "/admin/purchases",
    },
];

function AdminDashboard() {
    return (
        <section className="admin-page" aria-labelledby="admin-dashboard-title">
            <header className="admin-page-header">
                <div>
                    <p className="admin-eyebrow">Administración</p>
                    <h1 id="admin-dashboard-title">Panel de administración</h1>
                    <p>Selecciona el módulo que quieres gestionar.</p>
                </div>
            </header>

            <ul className="admin-module-grid">
                {adminModules.map((module) => (
                    <li key={module.path}>
                        <Link to={module.path} className="admin-module-card">
                            <h2>{module.title}</h2>
                            <p>{module.description}</p>
                        </Link>
                    </li>
                ))}
            </ul>
        </section>
    );
}

export default AdminDashboard;
