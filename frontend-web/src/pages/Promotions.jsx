import ProductSection from "../components/sections/ProductSection";
import CardHorizontal from "../components/cards/CardHorizontal";
import { usePromotions } from "../hooks/usePromotions";

function Promotions() {
    const { promotions, loading, error } = usePromotions();

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
                loading={loading}
                error={error}
                page={null}
                CardComponent={CardHorizontal}
            />
        </div>
    );
}

export default Promotions;
