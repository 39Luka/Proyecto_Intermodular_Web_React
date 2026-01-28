import ProductSection from "../components/sections/ProductSection";
import CardHorizontal from "../components/cards/CardHorizontal";
import { usePromotions } from "../hooks/usePromotions";

function Promotions() {
    const { promotions, loading, error } = usePromotions();

    if (loading) return <div style={{ textAlign: "center", padding: "2rem" }}>Cargando promociones...</div>;
    if (error) return <div style={{ textAlign: "center", padding: "2rem", color: "red" }}>Error: {error}</div>;

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
