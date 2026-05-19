import { useNavigate } from "react-router-dom";
import ProductSection from "../components/sections/ProductSection";
import CardHorizontal from "../components/cards/CardHorizontal";
import { usePromotions } from "../hooks/usePromotions";
import { useState, useMemo, useEffect } from "react";
import { useSearch } from "../context/SearchContext";
import Pagination from "../components/ui/Pagination";

function Promotions() {
    const { promotions, loading, error } = usePromotions();
    const navigate = useNavigate();
    const [page, setPage] = useState(0);
    const { searchTerm, setLoading } = useSearch();
    const pageSize = 12;

    // Señalar el estado de carga global a la cabecera
    useEffect(() => {
        setLoading(loading);
        return () => setLoading(false);
    }, [loading, setLoading]);

    // Filtrar promociones por descripción (título) o nombre de producto (detailLeft)
    const filteredPromotions = useMemo(() => {
        if (!searchTerm.trim()) return promotions;
        const query = searchTerm.toLowerCase();
        return promotions.filter(promo => 
            (promo.title && promo.title.toLowerCase().includes(query)) ||
            (promo.detailLeft && promo.detailLeft.toLowerCase().includes(query))
        );
    }, [promotions, searchTerm]);

    // Restablecer la paginación a la primera página cuando cambie la búsqueda
    useEffect(() => {
        setPage(0);
    }, [searchTerm]);

    const totalPages = Math.max(1, Math.ceil(filteredPromotions.length / pageSize));
    
    const paginatedPromotions = useMemo(() => {
        const start = page * pageSize;
        return filteredPromotions.slice(start, start + pageSize);
    }, [filteredPromotions, page, pageSize]);

    const handleNavigate = (promoId) => {
        const promo = promotions.find(p => p.id === promoId);
        if (promo && promo.productId) {
            navigate(`/products/${promo.productId}`);
        }
    };

    return (
        <div className="commerce-page">
            <section className="page-intro">
                <p className="page-intro__eyebrow">Ofertas activas</p>
                <h1 className="page-intro__title">Promociones destacadas</h1>
                <p className="page-intro__description">
                    Aprovecha nuestros descuentos exclusivos. Haz clic en cualquier oferta para ver el producto y añadirlo a tu carrito.
                </p>
            </section>

            <ProductSection
                title="Promociones disponibles"
                eyebrow="Ahorro"
                description="Descuentos vigentes para aprovechar en los productos con más salida."
                products={paginatedPromotions}
                loading={loading}
                error={error}
                page="products"
                onNavigate={handleNavigate}
                CardComponent={CardHorizontal}
            />

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

export default Promotions;
