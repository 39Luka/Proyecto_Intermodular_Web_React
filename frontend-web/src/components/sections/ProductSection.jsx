import { useState, useEffect } from "react";
import ProductList from "./ProductList";
import SectionBase from "./SectionBase";

/**
 * Sección de listado de productos con estados de carga, error y lista vacía.
 *
 * @component
 * @param {Object}   props
 * @param {string}   [props.title]          - Título principal de la sección.
 * @param {Array}    props.products          - Array de objetos producto a renderizar.
 * @param {string}   [props.page='products'] - Identificador de página para `ProductList`.
 * @param {React.ElementType} props.CardComponent - Componente de tarjeta a usar (CardVertical, CardHorizontal…).
 * @param {string}   [props.eyebrow]         - Texto eyebrow encima del título.
 * @param {string}   [props.description]     - Descripción debajo del título.
 * @param {string}   [props.emptyVariant=''] - Clase CSS adicional para el estado vacío.
 * @param {string}   [props.emptyTitle]      - Título del estado vacío.
 * @param {string}   [props.emptyDescription] - Descripción del estado vacío.
 * @param {Function} [props.onNavigate]      - Callback de navegación pasado a las tarjetas.
 * @param {boolean}  props.loading           - `true` mientras se cargan los datos.
 * @param {string|null} props.error          - Mensaje de error si la carga falló.
 * @returns {JSX.Element} Sección con spinner, lista o estado vacío/error.
 *
 * @example
 * <ProductSection
 *   title="Más vendidos"
 *   products={topProducts}
 *   CardComponent={CardVertical}
 *   loading={loading}
 *   error={error}
 *   onNavigate={(id) => navigate(`/products/${id}`)}
 * />
 */
function ProductSection({
    title,
    products,
    page = "products",
    CardComponent,
    eyebrow,
    description,
    emptyVariant = "",
    emptyTitle = "Sin elementos por ahora.",
    emptyDescription = "Volverá a mostrarse contenido aquí en cuanto esté disponible.",
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
            }, 8000); // Tiempo de espera de 8 segundos
        } else {
            setTimeoutError(false);
        }
        return () => clearTimeout(timer);
    }, [loading]);

    const hasProducts = Array.isArray(products) && products.length > 0;
    const isError = error || timeoutError;

    return (
        <SectionBase title={title} eyebrow={eyebrow} description={description}>
            <div className="section-body-wrapper">
                {loading && !timeoutError ? (
                    <div className="section-loader-wrap">
                        <div className="section-spinner" aria-label="Cargando..."></div>
                        <p className="section-loader-text">Cargando {title ? title.toLowerCase() : "contenido"}...</p>
                        <p className="section-loader-subtext">Un momento por favor.</p>
                    </div>
                ) : hasProducts ? (
                    <ul className="cards-container">
                        <ProductList products={products} page={page} CardComponent={CardComponent} onNavigate={onNavigate} />
                    </ul>
                ) : (
                    <div className="empty-state-wrap">
                        <div className={`empty-state empty-state--subtle ${emptyVariant}`.trim()}>
                            <p className="empty-state__title">{isError ? "Servicio no disponible" : emptyTitle}</p>
                            <p className="empty-state__description">{isError ? "No hemos podido conectar con el obrador. Inténtalo de nuevo más tarde." : emptyDescription}</p>
                        </div>
                    </div>
                )}
            </div>
        </SectionBase>
    );
}

export default ProductSection;
