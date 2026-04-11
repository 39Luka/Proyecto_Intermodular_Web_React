import CardVertical from "../components/cards/CardVertical";
import ProductSection from "../components/sections/ProductSection";
import { useTopSelling } from "../hooks/useProducts";

function Home() {
    const { products, loading, error } = useTopSelling();

    if (loading) return <div className="status-message">Cargando productos...</div>;
    if (error) return <div className="status-message status-message--error">Error: {error}</div>;

    return (
        <>
            <ProductSection
                title="Lo más vendido"
                products={products}
                CardComponent={CardVertical}
            />

        </>
    )
}

export default Home;