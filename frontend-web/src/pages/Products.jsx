import { useState, useMemo } from "react";
import ProductSection from "../components/sections/ProductSection";
import CardVertical from "../components/cards/CardVertical";
import { useProducts } from "../hooks/useProducts";
import { useCategories } from "../hooks/useCategories";

function Products() {
    const [page, setPage] = useState(0);
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);
    
    const { products, loading, error, totalPages } = useProducts(selectedCategoryId, page, 12);
    const { categories, loading: categoriesLoading } = useCategories();

    const handleCategoryChange = (id) => {
        setSelectedCategoryId(id);
        setPage(0);
    };

    const pagination = useMemo(() => {
        if (totalPages <= 1) return null;
        return (
            <div className="pagination">
                <button 
                    className="button button--secondary" 
                    disabled={page === 0} 
                    onClick={() => setPage(p => p - 1)}
                >
                    Anterior
                </button>
                <span className="pagination__info">Página {page + 1} de {totalPages}</span>
                <button 
                    className="button button--secondary" 
                    disabled={page >= totalPages - 1} 
                    onClick={() => setPage(p => p + 1)}
                >
                    Siguiente
                </button>
            </div>
        );
    }, [page, totalPages]);

    return (
        <div className="catalog-page">
            <section className="page-intro">
                <p className="page-intro__eyebrow">Catálogo</p>
                <h1 className="page-intro__title">El mostrador completo, organizado por categorías.</h1>
                <p className="page-intro__description">
                    Nuestra selección completa organizada por categorías.
                </p>
            </section>

            <div className="catalog-filters">
                <button
                    className={`button ${selectedCategoryId === null ? "button--primary" : "button--secondary"}`}
                    onClick={() => handleCategoryChange(null)}
                >
                    Todo
                </button>
                {!categoriesLoading && categories.map(cat => (
                    <button
                        key={cat.id}
                        className={`button ${selectedCategoryId === cat.id ? "button--primary" : "button--secondary"}`}
                        onClick={() => handleCategoryChange(cat.id)}
                    >
                        {cat.name}
                    </button>
                ))}
            </div>

            <ProductSection
                title={selectedCategoryId ? categories.find(c => c.id === selectedCategoryId)?.name : "Todos los productos"}
                eyebrow="Selección"
                products={products}
                loading={loading}
                error={error}
                CardComponent={CardVertical}
                page="catalog"
            />

            {pagination}
        </div>
    );
}

export default Products;
