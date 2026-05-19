import ProductSection from "../components/sections/ProductSection";
import CardHorizontal from "../components/cards/CardHorizontal";
import { usePurchases } from "../hooks/usePurchases";
import { useSearch } from "../context/SearchContext";
import { useState, useMemo, useEffect } from "react";
import Pagination from "../components/ui/Pagination";

function Purchased() {
    const { appliedDates, setLoading } = useSearch();
    const { purchases, loading, error } = usePurchases(appliedDates.start, appliedDates.end);
    const [page, setPage] = useState(0);
    const pageSize = 8; // Menos elementos por página para las compras ya que son tarjetas detalladas

    // Señalar el estado de carga global a la cabecera
    useEffect(() => {
        setLoading(loading);
        return () => setLoading(false);
    }, [loading, setLoading]);

    const totalPages = Math.max(1, Math.ceil(purchases.length / pageSize));

    const paginatedPurchases = useMemo(() => {
        const start = page * pageSize;
        return purchases.slice(start, start + pageSize);
    }, [purchases, page, pageSize]);

    return (
        <div className="commerce-page">
            <section className="page-intro">
                <p className="page-intro__eyebrow">Historial</p>
                <h1 className="page-intro__title">Tus pedidos con una lectura más limpia y útil.</h1>
                <p className="page-intro__description">
                    Estado, importe y acceso directo al detalle de cada compra sin apariencia de listado improvisado.
                </p>
            </section>

            <ProductSection
                title="Mis compras"
                eyebrow="Pedidos"
                description="Seguimiento visual de lo que ya has comprado en el obrador."
                products={paginatedPurchases}
                loading={loading}
                error={error}
                page="purchased"
                CardComponent={CardHorizontal}
                emptyTitle="Aún no hay pedidos."
                emptyDescription="Tu historial aparecerá aquí."
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

export default Purchased;
