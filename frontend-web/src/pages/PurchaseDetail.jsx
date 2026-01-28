import { useParams, useNavigate } from "react-router-dom";
import { usePurchaseDetail } from "../hooks/usePurchaseDetail";
import { formatStatus } from "../utils/formatters";
import CardHorizontal from "../components/cards/CardHorizontal";

function PurchaseDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { purchase, details, productsMap, loading, error } = usePurchaseDetail(id);

    if (loading) return <div style={{ textAlign: "center", padding: "4rem" }}>Cargando detalle de compra...</div>;
    if (error) return <div style={{ textAlign: "center", padding: "4rem", color: "red" }}>Error: {error}</div>;
    if (!purchase) return <div style={{ textAlign: "center", padding: "4rem" }}>Compra no encontrada</div>;

    const formattedDate = new Date(purchase.title).toLocaleDateString() || purchase.title;

    // Navigation handler
    const handleNavigateToProduct = (productId) => {
        navigate(`/products/${productId}`);
    };

    // Map details to card format
    const cardItems = details.map(line => {
        const product = productsMap[line.productId];
        return {
            id: line.productId, // Use productId for navigation
            title: line.title || `Producto #${line.productId}`,
            description: product?.description || "",
            image: product?.image || "",
            detailLeft: `Cantidad: ${line.quantity}`,
            detailRight: `${line.subtotal?.toFixed(2) || "0.00"}€`
        };
    });

    return (
        <div className="purchase-detail-wrapper">
            <div className="purchase-detail-header">
                <h1 className="purchase-detail-title">Detalle de Compra</h1>
                <button className="button button--text" onClick={() => navigate(-1)}>
                    ← Volver
                </button>
            </div>

            <div className="purchase-detail-container">
                {/* Left Side: Purchase Info */}
                <section className="purchase-info">
                    <h2 className="section-title">Información General</h2>
                    <div className="info-card">
                        <div className="info-row">
                            <span className="label">Fecha:</span>
                            <span className="value">{formattedDate}</span>
                        </div>
                        <div className="info-row">
                            <span className="label">Estado:</span>
                            <span className={`status-badge ${purchase.description.includes("PENDIENTE") ? "pending" : "completed"}`}>
                                {formatStatus(purchase.description.replace("Estado: ", ""))}
                            </span>
                        </div>
                        <div className="info-row total-row">
                            <span className="label">Total:</span>
                            <span className="value">
                                {details.reduce((acc, item) => acc + (item.subtotal || 0), 0).toFixed(2)}€
                            </span>
                        </div>
                    </div>
                </section>

                {/* Right Side: Order Lines */}
                <section className="purchase-lines">
                    <h2 className="section-title">Productos ({details.length})</h2>
                    {details.length === 0 ? (
                        <div className="empty-state">No hay productos en esta compra.</div>
                    ) : (
                        <div className="cards-container">
                            {cardItems.map((item) => (
                                <CardHorizontal
                                    key={item.id}
                                    id={item.id}
                                    title={item.title}
                                    description={item.description}
                                    image={item.image}
                                    detailLeft={item.detailLeft}
                                    detailRight={item.detailRight}
                                    onNavigate={handleNavigateToProduct}
                                />
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}

export default PurchaseDetail;
