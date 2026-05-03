import CardVertical from "../components/cards/CardVertical";
import ProductSection from "../components/sections/ProductSection";
import { useTopSelling } from "../hooks/useProducts";
import { Link } from "react-router-dom";

const highlights = [
    { label: "Hecho cada manana", value: "100%" },
    { label: "Recogida preparada", value: "Rapida" },
    { label: "Producto estrella", value: "Croissant" },
];

function Home() {
    const { products, loading, error } = useTopSelling();

    if (loading) return <div className="status-message">Cargando productos...</div>;
    if (error) return <div className="status-message status-message--error">Error: {error}</div>;

    return (
        <>
            <section className="home-hero">
                <div className="home-hero__copy">
                    <p className="home-hero__eyebrow">Panaderia digital con alma de obrador</p>
                    <h1 className="home-hero__title">Hojaldre serio, cafe bueno y una tienda que por fin se siente premium.</h1>
                    <p className="home-hero__description">
                        Seleccionamos las piezas mas deseadas del dia y las presentamos con una experiencia mas limpia,
                        mas calida y mucho mejor pensada para comprar.
                    </p>
                    <div className="home-hero__actions">
                        <Link className="button button--primary" to="/products">Ver catalogo</Link>
                        <Link className="button button--secondary" to="/promo">Explorar promociones</Link>
                    </div>
                </div>

                <div className="home-hero__panel">
                    {highlights.map((item) => (
                        <div className="home-hero__metric" key={item.label}>
                            <span className="home-hero__metric-value">{item.value}</span>
                            <span className="home-hero__metric-label">{item.label}</span>
                        </div>
                    ))}
                </div>
            </section>

            <ProductSection
                title="Lo mas buscado del obrador"
                eyebrow="Favoritos"
                description="Una seleccion con salida real: piezas que la gente repite, regala y vuelve a pedir."
                products={products}
                CardComponent={CardVertical}
            />
        </>
    );
}

export default Home;
