import ProductSection from "../components/sections/ProductSection";
import CardHorizontal from "../components/cards/CardHorizontal";
import { usePurchases } from "../hooks/usePurchases";

function Purchased() {
    const { purchases, loading, error } = usePurchases();

    if (loading) return <div className="status-message">Cargando compras...</div>;
    if (error) return <div className="status-message status-message--error">Error: {error}</div>;

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
