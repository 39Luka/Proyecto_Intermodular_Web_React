import { useParams, useNavigate } from "react-router-dom";
import { usePurchaseDetail } from "../hooks/usePurchaseDetail";
import PurchaseInfo from "../components/purchase/PurchaseInfo";
import PurchaseLines from "../components/purchase/PurchaseLines";

function PurchaseDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { purchase, details, productsMap, loading, error } = usePurchaseDetail(id);

    if (loading) return <div className="status-message">Cargando detalle de compra...</div>;
    if (error) return <div className="status-message status-message--error">Error: {error}</div>;
    if (!purchase) return <div className="status-message">Compra no encontrada</div>;

    const handlePay = async () => {
        try {
            const { purchaseService } = await import("../services/purchaseService");
            await purchaseService.payPurchase(id);
            window.location.reload();
        } catch (err) {
            alert("Error al pagar: " + err.message);
        }
    };

    const handleCancel = async () => {
        if (!window.confirm("¿Estás seguro de cancelar esta compra?")) return;
        try {
            const { purchaseService } = await import("../services/purchaseService");
            await purchaseService.cancelPurchase(id);
            window.location.reload();
        } catch (err) {
            alert("Error al cancelar: " + err.message);
        }
    };

    const handleNavigateToProduct = (productId) => {
        navigate(`/products/${productId}`);
    };

    return (
        <div className="commerce-page">
            <section className="page-intro">
                <p className="page-intro__eyebrow">Seguimiento</p>
                <h1 className="page-intro__title">Detalle de compra con información mejor ordenada.</h1>
                <p className="page-intro__description">
                    Estado, productos y acciones de la compra dentro de una vista más clara y más útil.
                </p>
            </section>

            <div className="purchase-detail-wrapper">
                <div className="purchase-detail-header">
                    <h2 className="purchase-detail-title">Compra #{purchase.id}</h2>
                    <button className="button button--secondary" onClick={() => navigate(-1)}>
                        Volver
                    </button>
                </div>

                <div className="purchase-detail-container">
                    <PurchaseInfo
                        purchase={purchase}
                        details={details}
                        onPay={handlePay}
                        onCancel={handleCancel}
                    />

                    <PurchaseLines
                        details={details}
                        productsMap={productsMap}
                        onNavigate={handleNavigateToProduct}
                    />
                </div>
            </div>
        </div>
    );
}

export default PurchaseDetail;
