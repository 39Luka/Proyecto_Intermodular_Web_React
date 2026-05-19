/**
 * Barra de paginación con botones anterior/siguiente.
 *
 * Renderiza un `<nav>` con botones de navegación de página y un indicador
 * textual del tipo "Página X de Y". Los botones se deshabilitan automáticamente
 * en los extremos (primera y última página).
 * Retorna `null` si `totalPages` es 0 (sin resultados).
 *
 * @component
 * @param {Object}   props
 * @param {number}   props.currentPage  - Página actual (índice base 0).
 * @param {number}   props.totalPages   - Número total de páginas.
 * @param {Function} props.onPageChange - Callback `(newPage: number) => void` con el índice base 0 de la nueva página.
 * @returns {JSX.Element|null} Barra de paginación o `null` si no hay páginas.
 *
 * @example
 * <Pagination
 *   currentPage={page}
 *   totalPages={totalPages}
 *   onPageChange={(newPage) => setPage(newPage)}
 * />
 */
function Pagination({ currentPage, totalPages, onPageChange }) {
    // Mostrar siempre si hay al menos una página
    if (totalPages === 0) return null;

    return (
        <nav className="pagination" aria-label="Paginación">
            <button
                className="pagination__btn pagination__btn--nav"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 0}
                aria-label="Página anterior"
            >
                ‹
            </button>

            <span className="pagination__info">
                Página {currentPage + 1} de {totalPages}
            </span>

            <button
                className="pagination__btn pagination__btn--nav"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage >= totalPages - 1}
                aria-label="Página siguiente"
            >
                ›
            </button>
        </nav>
    );
}

export default Pagination;
