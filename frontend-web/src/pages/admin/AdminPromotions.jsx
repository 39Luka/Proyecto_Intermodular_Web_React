import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { promotionService } from "../../services/promotionService";

/**
 * AdminPromotions - Gestión de promociones activas e inactivas.
 */
function AdminPromotions() {
    const [promotions, setPromotions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPromotions();
    }, []);

    const fetchPromotions = async () => {
        try {
            setLoading(true);
            const data = await promotionService.getAllPromotions();
            setPromotions(data);
        } catch (err) {
            console.error("Error al cargar promociones", err);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleActive = async (id, currentStatus) => {
        try {
            await promotionService.patchPromotion(id, !currentStatus);
            setPromotions(prev => 
                prev.map(p => p.id === id ? { ...p, active: !currentStatus } : p)
            );
        } catch (err) {
            alert("No se pudo cambiar el estado de la promoción.");
            console.error(err);
        }
    };

    if (loading) return <div className="admin-loading">Cargando promociones...</div>;

    return (
        <div className="admin-page">
            <header className="admin-page-header">
                <div>
                    <Link to="/admin" className="back-link">← Volver al Panel</Link>
                    <h1>Gestión de Promociones</h1>
                </div>
                {/* Por ahora no implementamos el formulario complejo de creación para abreviar */}
                <span className="info-badge">Nuevas promociones vía API</span>
            </header>

            <div className="admin-table-wrapper">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Descripción</th>
                            <th>Descuento</th>
                            <th>Vigencia</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {promotions.map((promo) => (
                            <tr key={promo.id}>
                                <td>
                                    <strong>{promo.description}</strong>
                                    <div style={{fontSize: '0.8rem', color: '#666'}}>ID Producto: {promo.productId}</div>
                                </td>
                                <td>{promo.discountPercentage}%</td>
                                <td style={{fontSize: '0.85rem'}}>
                                    {new Date(promo.startDate).toLocaleDateString()} - {new Date(promo.endDate).toLocaleDateString()}
                                </td>
                                <td>
                                    <span className={`status-pill ${promo.active ? 'active' : 'inactive'}`}>
                                        {promo.active ? "Activa" : "Inactiva"}
                                    </span>
                                </td>
                                <td>
                                    <button 
                                        onClick={() => handleToggleActive(promo.id, promo.active)}
                                        className={`action-btn ${promo.active ? 'delete' : 'edit'}`}
                                    >
                                        {promo.active ? "Desactivar" : "Activar"}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <style>{`
                .status-pill {
                    padding: 0.2rem 0.6rem;
                    border-radius: 9999px;
                    font-size: 0.75rem;
                    font-weight: 600;
                    text-transform: uppercase;
                }
                .status-pill.active { background: #dcfce7; color: #166534; }
                .status-pill.inactive { background: #f3f4f6; color: #4b5563; }
                .info-badge {
                    background: #eff6ff;
                    color: #1d4ed8;
                    padding: 0.5rem 1rem;
                    border-radius: 0.5rem;
                    font-size: 0.85rem;
                }
            `}</style>
        </div>
    );
}

export default AdminPromotions;
