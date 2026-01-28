import CardVertical from "../components/cards/CardVertical";
import ProductSection from "../components/sections/ProductSection";
import { useProducts } from "../hooks/useProducts";

function Home() {
    const { products, loading, error } = useProducts();

    if (loading) return <div style={{ textAlign: "center", padding: "2rem" }}>Cargando productos...</div>;
    if (error) return <div style={{ textAlign: "center", padding: "2rem", color: "red" }}>Error: {error}</div>;

    return (
        <>
            <ProductSection
                title="Inicio"
                products={products}
                CardComponent={CardVertical}
            />

        </>
    )
}

export default Home;