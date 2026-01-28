import ProductSection from "../components/sections/ProductSection";
import CardHorizontal from "../components/cards/CardHorizontal";
import { usePurchases } from "../hooks/usePurchases";

function Purchased() {
    const { purchases, loading, error } = usePurchases();

    if (loading) return <div style={{ textAlign: "center", padding: "2rem" }}>Cargando compras...</div>;
    if (error) return <div style={{ textAlign: "center", padding: "2rem", color: "red" }}>Error: {error}</div>;

    return (
        <ProductSection
            title="Mis Compras"
            products={purchases}
            page="purchased"
            CardComponent={CardHorizontal}
        />
    );
}

export default Purchased;
