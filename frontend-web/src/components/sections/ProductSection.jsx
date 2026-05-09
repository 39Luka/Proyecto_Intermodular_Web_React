import { useState, useEffect } from "react";
import ProductList from "./ProductList";
import SectionBase from "./SectionBase";

function ProductSection({
    title,
    products,
    page = "products",
    CardComponent,
    eyebrow,
    description,
    emptyVariant = "",
    emptyTitle = "Sin elementos por ahora.",
    emptyDescription = "Volvera a mostrarse contenido aqui en cuanto este disponible.",
    onNavigate,
    loading,
    error
}) {
    const [timeoutError, setTimeoutError] = useState(false);

    useEffect(() => {
        let timer;
        if (loading) {
            timer = setTimeout(() => {
                setTimeoutError(true);
            }, 8000); // 8 seconds timeout
        } else {
            setTimeoutError(false);
        }
        return () => clearTimeout(timer);
    }, [loading]);

    const hasProducts = Array.isArray(products) && products.length > 0;
    const isError = error || timeoutError;

    return (
        <SectionBase title={title} eyebrow={eyebrow} description={description}>
            {loading && !timeoutError && !hasProducts ? (
                <div className="empty-state-wrap">
                    <div className={`empty-state empty-state--subtle ${emptyVariant}`.trim()}>
                        <p className="empty-state__title">Cargando {title ? title.toLowerCase() : "contenido"}...</p>
                        <p className="empty-state__description">Un momento por favor.</p>
                    </div>
                </div>
            ) : hasProducts ? (
                <div className="cards-container">
                    <ProductList products={products} page={page} CardComponent={CardComponent} onNavigate={onNavigate} />
                </div>
            ) : (
                <div className="empty-state-wrap">
                    <div className={`empty-state empty-state--subtle ${emptyVariant}`.trim()}>
                        <p className="empty-state__title">{isError ? "Servicio no disponible" : emptyTitle}</p>
                        <p className="empty-state__description">{isError ? "No hemos podido conectar con el obrador. Inténtalo de nuevo más tarde." : emptyDescription}</p>
                    </div>
                </div>
            )}
        </SectionBase>
    );
}

export default ProductSection;
