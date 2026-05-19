import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { purchaseService } from "../../services/purchaseService";
import { userService } from "../../services/userService";
import { formatPrice, formatStatus, formatDate } from "../../utils/formatters";
import Pagination from "../../components/ui/Pagination";

function AdminPurchases() {
    const [purchases, setPurchases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [emailFilter, setEmailFilter] = useState("");
    const [userEmails, setUserEmails] = useState({});
    const [startDateFilter, setStartDateFilter] = useState("");
    const [endDateFilter, setEndDateFilter] = useState("");
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const pageSize = 15;

    useEffect(() => {
        fetchPurchases(emailFilter, startDateFilter, endDateFilter);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page]);

    async function fetchPurchases(email = null, startDate = null, endDate = null) {
        try {
            setLoading(true);
            setError("");
            let filterId = null;

            if (email) {
                try {
                    const response = await userService.getUserByEmail(email);
                    const usersList = response?.content ? response.content : (Array.isArray(response) ? response : (response?.id ? [response] : []));
                    
                    if (usersList.length === 0) throw new Error();
                    filterId = usersList[0].id;
                } catch {
                    setPurchases([]);
                    setTotalPages(1);
                    setError("No se ha encontrado un usuario con ese email.");
                    setLoading(false);
                    return;
                }
            }
            
            const start = startDate ? `${startDate}T00:00:00` : null;
            const end = endDate ? `${endDate}T23:59:59` : null;
            
            const { purchases: data, totalPages: total } = await purchaseService.getAllPurchases(page, pageSize, filterId, start, end);
            setPurchases(data);
            setTotalPages(total);
            
            const uniqueUserIds = [...new Set(data.map(p => p.userId))];
            const fetchedEmails = {};
            await Promise.allSettled(uniqueUserIds.map(async (id) => {
                const u = await userService.getUserById(id);
                if (u && u.email) fetchedEmails[id] = u.email;
            }));
            
            if (Object.keys(fetchedEmails).length > 0) {
                setUserEmails(prev => ({ ...prev, ...fetchedEmails }));
            }
        } catch (err) {
            setError(err.message || "No se pudieron cargar las compras.");
        } finally {
            setLoading(false);
        }
    }

    const handleFilterSubmit = (e) => {
        e.preventDefault();
        setPage(0);
        fetchPurchases(emailFilter, startDateFilter, endDateFilter);
    };

    const handleClearFilter = () => {
        setEmailFilter("");
        setStartDateFilter("");
        setEndDateFilter("");
        setPage(0);
        fetchPurchases(null, null, null);
    };

    const handleCancel = async (id) => {
        if (!window.confirm(`¿Estás seguro de cancelar la compra #${id}?`)) return;
        try {
            await purchaseService.cancelPurchase(id);
            fetchPurchases(emailFilter, startDateFilter, endDateFilter);
        } catch (err) {
            alert("Error al cancelar: " + err.message);
        }
    };

    if (loading && purchases.length === 0) {
        return (
            <div className="section-loader-wrap section-loader-wrap--compact">
                <div className="section-spinner" aria-label="Cargando..."></div>
                <p className="section-loader-text">Cargando ventas...</p>
                <p className="section-loader-subtext">Un momento por favor.</p>
            </div>
        );
    }

    return (
        <section className="admin-page admin-stack" aria-labelledby="admin-purchases-title">
            <header className="admin-page-header">
                <div>
                    <Link to="/admin" className="back-link">Volver al panel</Link>
                    <h1 id="admin-purchases-title">Gestión de ventas</h1>
                </div>
            </header>

            <form onSubmit={handleFilterSubmit} className="admin-filter-form">
                <input
                    type="text"
                    value={emailFilter}
                    onChange={(e) => setEmailFilter(e.target.value)}
                    placeholder="Email del usuario"
                    className="form-input admin-filter-form__input--email"
                    aria-label="Filtrar por email del usuario"
                />
                <input
                    type="date"
                    value={startDateFilter}
                    onChange={(e) => setStartDateFilter(e.target.value)}
                    className="form-input"
                    aria-label="Fecha de inicio"
                />
                <span>hasta</span>
                <input
                    type="date"
                    value={endDateFilter}
                    onChange={(e) => setEndDateFilter(e.target.value)}
                    className="form-input"
                    aria-label="Fecha de fin"
                />
                <button type="submit" className="button button--secondary">Filtrar</button>
                {(emailFilter || startDateFilter || endDateFilter) && (
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
                            <th scope="col">Usuario</th>
                            <th scope="col">Fecha</th>
                            <th scope="col">Total</th>
                            <th scope="col">Estado</th>
                            <th scope="col">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {purchases.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="text-center p-2">
                                    No hay compras registradas.
                                </td>
                            </tr>
                        ) : (
                            purchases.map((purchase) => (
                                <tr key={purchase.id}>
                                    <th scope="row">#{purchase.id}</th>
                                    <td>{userEmails[purchase.userId] || `ID: ${purchase.userId}`}</td>
                                    <td>
                                        {purchase.createdAt ? (
                                            <time dateTime={purchase.createdAt}>{formatDate(purchase.createdAt)}</time>
                                        ) : (
                                            "N/A"
                                        )}
                                    </td>
                                    <td>{formatPrice(purchase.total || 0)}</td>
                                    <td>
                                        <span className={`status-badge status-badge--${purchase.status?.toLowerCase()}`}>
                                            {formatStatus(purchase.status)}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="flex gap-05">
                                            <Link to={`/purchased/${purchase.id}`} className="button button--text admin-table-action-btn">
                                                Ver
                                            </Link>
                                            {purchase.status === "CREATED" && (
                                                <button
                                                    onClick={() => handleCancel(purchase.id)}
                                                    className="button button--text admin-table-action-btn admin-table-action-btn--danger"
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

            <Pagination 
                currentPage={page} 
                totalPages={totalPages} 
                onPageChange={setPage} 
            />
        </section>
    );
}

export default AdminPurchases;
