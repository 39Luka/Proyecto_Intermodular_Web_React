import ProductSection from "../components/sections/ProductSection";
import CardHorizontal from "../components/cards/CardHorizontal";
import { usePromotions } from "../hooks/usePromotions";

function Promotions() {
    const { promotions, loading, error } = usePromotions();

    if (loading) return <div className="status-message">Cargando promociones...</div>;
    if (error) return <div className="status-message status-message--error">Error: {error}</div>;

    return (
        <div className="commerce-page">
            <section className="page-intro">
                <p className="page-intro__eyebrow">Ofertas activas</p>
                <h1 className="page-intro__title">Promociones con mejor contexto, no solo una lista plana.</h1>
                <p className="page-intro__description">
                    Cada oferta se presenta como una oportunidad real de compra, con lectura más clara y mejor ritmo visual.
                </p>
            </section>

            <ProductSection
                title="Promociones disponibles"
                eyebrow="Ahorro"
                description="Descuentos vigentes para aprovechar en los productos con más salida."
                products={promotions}
                page={null}
                CardComponent={CardHorizontal}
                emptyVariant="empty-state--accent"
                emptyTitle="No hay promociones activas."
                emptyDescription="Las ofertas aparecerán aquí."
            />
        </div>
    );
}

export default Promotions;
