/**
 * Placeholder de carga para las tarjetas de producto.
 *
 * Renderiza un esqueleto animado con las mismas dimensiones que `CardVertical`
 * para evitar el salto de contenido (CLS) mientras se cargan los datos reales.
 * No acepta props; su único propósito es visual.
 *
 * @component
 * @returns {JSX.Element} Contenedor con elementos skeleton animados.
 *
 * @example
 * // Mostrar 6 skeletons mientras cargan los productos
 * {loading && Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
 */
function CardSkeleton() {
    return (
        <div className="card-vertical card--static">
            <div className="card__figure skeleton">
                <div className="skeleton-image" />
            </div>
            <div className="card__content">
                <div className="skeleton skeleton-text skeleton-text--eyebrow" />
                <div className="skeleton skeleton-text skeleton-text--title" />
                <div className="skeleton skeleton-text" />
                <div className="skeleton skeleton-text skeleton-text--body-short" />
                <div className="card__meta card__meta--skeleton">
                    <div className="skeleton skeleton-text skeleton-text--meta-left" />
                    <div className="skeleton skeleton-text skeleton-text--meta-right" />
                </div>
            </div>
        </div>
    );
}

export default CardSkeleton;
