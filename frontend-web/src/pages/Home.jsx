import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import ProductSection from "../components/sections/ProductSection";
import CardVertical from "../components/cards/CardVertical";
import { useProducts, useTopSelling } from "../hooks/useProducts";

function Home() {
    const navigate = useNavigate();
    const { products: latest, loading: loadLatest, error: errLatest } = useProducts(null, 0, 4);
    const { products: top, loading: loadTop, error: errTop } = useTopSelling();

    const handleNavigate = (id) => navigate(`/products/${id}`);

    const sections = useMemo(() => [
        {
            id: "latest",
            title: "Novedades del Obrador",
            eyebrow: "Recién Salido",
            description: "Las últimas creaciones artesanales listas para disfrutar.",
            products: latest,
            loading: loadLatest,
            error: errLatest
        },
        {
            id: "top",
            title: "Favoritos de la Casa",
            eyebrow: "Lo más Vendido",
            description: "Los productos que nuestros clientes eligen día tras día.",
            products: top.slice(0, 4),
            loading: loadTop,
            error: errTop
        }
    ], [latest, loadLatest, errLatest, top, loadTop, errTop]);

    return (
        <div className="catalog-page">
            <section className="home-hero">
                <div className="home-hero__copy">
                    <p className="home-hero__eyebrow">Tradición en cada bocado</p>
                    <h1 className="home-hero__title">Pan y repostería artesanal.</h1>
                    <p className="home-hero__description">
                        Disfruta de productos horneados cada mañana con ingredientes naturales y procesos tradicionales.
                    </p>
                </div>

                <div className="home-hero__panel">
                    <div className="home-hero__metric">
                        <span className="home-hero__metric-value">100%</span>
                        <span className="home-hero__metric-label">Natural</span>
                    </div>
                    <div className="home-hero__metric">
                        <span className="home-hero__metric-value">24h</span>
                        <span className="home-hero__metric-label">Reposo</span>
                    </div>
                </div>
            </section>

            {sections.map(section => (
                <ProductSection
                    key={section.id}
                    title={section.title}
                    eyebrow={section.eyebrow}
                    description={section.description}
                    products={section.products}
                    loading={section.loading}
                    error={section.error}
                    CardComponent={CardVertical}
                    onNavigate={handleNavigate}
                    page="home"
                />
            ))}
        </div>
    );
}

export default Home;
