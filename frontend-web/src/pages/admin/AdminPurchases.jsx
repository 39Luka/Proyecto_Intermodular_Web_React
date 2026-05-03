import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { purchaseService } from "../../services/purchaseService";
import { formatPrice, formatStatus, formatDate } from "../../utils/formatters";

function AdminPurchases() {
    const [purchases, setPurchases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [userIdFilter, setUserIdFilter] = useState("");

    useEffect(() => {
        fetchPurchases();
    }, []);

    async function fetchPurchases(userId = null) {
        try {
            setLoading(true);
            setError("");
            // Si userId está vacío, mandamos null
            const filter = userId ? parseInt(userId, 10) : null;
            const data = await purchaseService.getAllPurchases(0, 100, filter);
            setPurchases(data);
        } catch (err) {
            setError(err.message || "No se pudieron cargar las compras.");
        } finally {
            setLoading(false);
        }
    }

    const handleFilterSubmit = (e) => {
        e.preventDefault();
        fetchPurchases(userIdFilter);
    };

    const handleClearFilter = () => {
        setUserIdFilter("");
        fetchPurchases(null);
    };

    const handleCancel = async (id) => {
        if (!window.confirm(`¿Estás seguro de cancelar la compra #${id}?`)) return;
        try {
            await purchaseService.cancelPurchase(id);
            fetchPurchases(userIdFilter);
        } catch (err) {
            alert("Error al cancelar: " + err.message);
        }
    };

    if (loading && purchases.length === 0) {
        return <div className="admin-loading">Cargando ventas...</div>;
    }

    return (
        <section className="admin-page admin-stack" aria-labelledby="admin-purchases-title">
            <header className="admin-page-header">
                <div>
                    <Link to="/admin" className="back-link">Volver al panel</Link>
                    <h1 id="admin-purchases-title">Gestion de ventas</h1>
                </div>
            </header>

            <form onSubmit={handleFilterSubmit} className="admin-filter-form" style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
                <input
                    type="number"
                    value={userIdFilter}
                    onChange={(e) => setUserIdFilter(e.target.value)}
                    placeholder="Filtrar por ID de usuario"
                    className="form-input"
                    min="1"
                />
                <button type="submit" className="button button--secondary">Filtrar</button>
                {userIdFilter && (
                    <button type="button" onClick={handleClearFilter} className="button button--text">
                        Limpiar
                    </button>
                )}
            </form>

            {error && <p className="admin-error-msg" role="alert">{error}</p>}

            <div className="admin-table-wrapper">
                <table className="admin-table">
                    <caption className="sr-only">Tabla de ventas de todos los usuarios</caption>
                    <thead>
                        <tr>
                            <th scope="col">ID Compra</th>
                            <th scope="col">Usuario ID</th>
                            <th scope="col">Fecha</th>
                            <th scope="col">Total</th>
                            <th scope="col">Estado</th>
                            <th scope="col">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {purchases.length === 0 ? (
                            <tr>
                                <td colSpan="5" style={{ textAlign: "center", padding: "2rem" }}>
                                    No hay compras registradas.
                                </td>
                            </tr>
                        ) : (
                            purchases.map((purchase) => (
                                <tr key={purchase.id}>
                                    <th scope="row">#{purchase.id}</th>
                                    <td>{purchase.userId}</td>
                                    <td>{purchase.createdAt ? formatDate(purchase.createdAt) : "N/A"}</td>
                                    <td>{formatPrice(purchase.total || 0)}</td>
                                    <td>
                                        <span className={`status-badge status-badge--${purchase.status?.toLowerCase()}`}>
                                            {formatStatus(purchase.status)}
                                        </span>
                                    </td>
                                    <td>
                                        <div style={{ display: "flex", gap: "0.5rem" }}>
                                            <Link to={`/purchased/${purchase.id}`} className="button button--text" style={{ padding: "0.25rem 0.5rem" }}>
                                                Ver
                                            </Link>
                                            {purchase.status === "CREATED" && (
                                                <button
                                                    onClick={() => handleCancel(purchase.id)}
                                                    className="button button--text"
                                                    style={{ padding: "0.25rem 0.5rem", color: "var(--color-error, #ff4444)" }}
                                                >
                                                    Cancelar
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </section>
    );
}

export default AdminPurchases;
