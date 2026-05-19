import { useState, useEffect } from "react";
import ProductSection from "../components/sections/ProductSection";
import CardVertical from "../components/cards/CardVertical";
import { useProducts } from "../hooks/useProducts";
import { useCategories } from "../hooks/useCategories";
import { useSearch } from "../context/SearchContext";
import Pagination from "../components/ui/Pagination";

function Products() {
    const [page, setPage] = useState(0);
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);
    const { searchTerm, setLoading } = useSearch();
    const [debouncedSearch, setDebouncedSearch] = useState("");

    // Antirrebote (debounce) para los cambios del input de búsqueda para evitar saturar la API del backend
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(searchTerm);
            setPage(0);
        }, 400);

        return () => {
            clearTimeout(handler);
        };
    }, [searchTerm]);
    
    const { products, loading, error, totalPages } = useProducts(selectedCategoryId, page, 12, debouncedSearch);
    const { categories, loading: categoriesLoading } = useCategories();

    // Señalar el estado de carga global a la cabecera
    useEffect(() => {
        setLoading(loading);
        // Limpiar el estado de carga al desmontar el componente
        return () => setLoading(false);
    }, [loading, setLoading]);

    const handleCategoryChange = (id) => {
        setSelectedCategoryId(id);
        setPage(0);
    };

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [page, selectedCategoryId]);


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

            <div className="catalog-section-wrapper">
                <ProductSection
                    title={selectedCategoryId ? categories.find(c => c.id === selectedCategoryId)?.name : "Todos los productos"}
                    eyebrow="Selección"
                    products={products}
                    loading={loading}
                    error={error}
                    CardComponent={CardVertical}
                    page="catalog"
                />
            </div>

            {!loading && totalPages > 1 && (
                <Pagination 
                    currentPage={page} 
                    totalPages={totalPages} 
                    onPageChange={setPage} 
                />
            )}
        </div>
    );
}

export default Products;
