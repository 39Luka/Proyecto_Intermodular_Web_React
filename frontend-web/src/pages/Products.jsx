import { useState, useEffect } from "react";
import CardVertical from "../components/cards/CardVertical";
import ProductSection from "../components/sections/ProductSection";
import { useProducts } from "../hooks/useProducts";
import { categoryService } from "../services/categoryService";

function Products() {
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const { products, loading, error } = useProducts(selectedCategory);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await categoryService.getCategories();
                setCategories(data);
            } catch (err) {
                console.error("Failed to load categories:", err);
            }
        };
        fetchCategories();
    }, []);

    if (loading && !products.length) return <div className="status-message">Cargando productos...</div>;
    if (error) return <div className="status-message status-message--error">Error: {error}</div>;

    return (
        <div className="catalog-page">
            <section className="page-intro">
                <p className="page-intro__eyebrow">Catalogo diario</p>
                <h1 className="page-intro__title">Una seleccion pensada para entrar por los ojos.</h1>
                <p className="page-intro__description">
                    Filtra por familia y explora cada pieza con una presentacion mas clara, apetecible y facil de comprar.
                </p>
            </section>

            <section className="catalog-filters">
                <button
                    className={`button ${!selectedCategory ? "button--primary" : "button--secondary"}`}
                    onClick={() => setSelectedCategory(null)}
                >
                    Todos
                </button>
                {categories.map((category) => (
                    <button
                        key={category.id}
                        className={`button ${selectedCategory === category.id ? "button--primary" : "button--secondary"}`}
                        onClick={() => setSelectedCategory(category.id)}
                    >
                        {category.name}
                    </button>
                ))}
            </section>

            <ProductSection
                title="Nuestro catalogo"
                eyebrow="Seleccion"
                description="Productos preparados para una experiencia mas visual, ordenada y comercial."
                products={products}
                CardComponent={CardVertical}
            />
        </div>
    );
}

export default Products;
