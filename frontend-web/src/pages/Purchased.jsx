import ProductSection from "../components/sections/ProductSection";
import CardHorizontal from "../components/cards/CardHorizontal";
import { usePurchases } from "../hooks/usePurchases";
import { purchaseService } from "../services/purchaseService";

function Purchased() {
    const { purchases, loading, error, refetch } = usePurchases();

    if (loading) return <div className="status-message">Cargando compras...</div>;
    if (error) return <div className="status-message status-message--error">Error: {error}</div>;

    return (
        <div className="commerce-page">
            <section className="page-intro">
                <p className="page-intro__eyebrow">Historial</p>
                <h1 className="page-intro__title">Tus pedidos con una lectura más limpia y útil.</h1>
                <p className="page-intro__description">
                    Estado, importe y acceso directo al detalle de cada compra sin apariencia de listado improvisado.
                </p>
            </section>

            <ProductSection
                title="Mis compras"
                eyebrow="Pedidos"
                description="Seguimiento visual de lo que ya has comprado en el obrador."
                products={purchases}
                page="purchased"
                CardComponent={CardHorizontal}
                emptyTitle="Aún no hay pedidos."
                emptyDescription="Tu historial aparecerá aquí."
            />
        </div>
    );
}

export default Purchased;
