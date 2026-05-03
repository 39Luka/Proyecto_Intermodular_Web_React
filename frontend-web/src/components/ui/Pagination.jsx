/**
 * Pagination component.
 * Renders numbered page buttons with prev/next arrows.
 * Shows ellipsis (…) when there are many pages.
 *
 * @param {number}   currentPage  - 0-indexed current page
 * @param {number}   totalPages   - Total number of pages
 * @param {function} onPageChange - Callback with new 0-indexed page number
 */
function Pagination({ currentPage, totalPages, onPageChange }) {
    if (!totalPages || totalPages <= 1) return null;

    // Build the array of page items to render
    const getPageItems = () => {
        const pages = [];
        const delta = 1; // pages shown around current
        const left = currentPage - delta;
        const right = currentPage + delta;

        let prevNum = null;
        for (let i = 0; i < totalPages; i++) {
            const isEdge = i === 0 || i === totalPages - 1;
            const isNearCurrent = i >= left && i <= right;

            if (isEdge || isNearCurrent) {
                if (prevNum !== null && i - prevNum > 1) {
                    pages.push({ type: "ellipsis", key: `e-${i}` });
                }
                pages.push({ type: "page", num: i, key: i });
                prevNum = i;
            }
        }
        return pages;
    };

    const items = getPageItems();

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

            {items.map((item) =>
                item.type === "ellipsis" ? (
                    <span key={item.key} className="pagination__ellipsis">…</span>
                ) : (
                    <button
                        key={item.key}
                        className={`pagination__btn${item.num === currentPage ? " pagination__btn--active" : ""}`}
                        onClick={() => onPageChange(item.num)}
                        aria-label={`Página ${item.num + 1}`}
                        aria-current={item.num === currentPage ? "page" : undefined}
                    >
                        {item.num + 1}
                    </button>
                )
            )}

            <button
                className="pagination__btn pagination__btn--nav"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages - 1}
                aria-label="Página siguiente"
            >
                ›
            </button>
        </nav>
    );
}

export default Pagination;
