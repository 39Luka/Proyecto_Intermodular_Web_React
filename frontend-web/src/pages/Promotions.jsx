import ProductSection from "../components/sections/ProductSection";
import CardHorizontal from "../components/cards/CardHorizontal";
import { usePromotions } from "../hooks/usePromotions";

function Promotions() {
    const { promotions, loading, error } = usePromotions();

    if (loading) return <div className="status-message">Cargando promociones...</div>;
    if (error) return <div className="status-message status-message--error">Error: {error}</div>;

    return (
        <ProductSection
            title="Mis Promociones"
            products={promotions}
            page={null}
            CardComponent={CardHorizontal}
        />
    );
}

export default Promotions;
