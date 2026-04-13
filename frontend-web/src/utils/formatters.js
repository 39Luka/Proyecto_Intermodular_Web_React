/**
 * Maps API purchase status values to Spanish display labels.
 * API status values: CREATED, PAID, CANCELLED
 * @param {string} status
 * @returns {string}
 */
const STATUS_LABELS = {
    CREATED: "Creada",
    PAID: "Pagada",
    CANCELLED: "Cancelada",
};

export const formatStatus = (status) => {
    if (!status) return "Desconocido";
    return STATUS_LABELS[status] ?? status.replace(/_/g, " ");
};

/**
 * Formats an ISO date string or date-only string to a human-readable format.
 * @param {string} dateStr - ISO date or date-only string (e.g. "2025-03-15" or "2025-03-15T10:30:00")
 * @returns {string}
 */
export const formatDate = (dateStr) => {
    if (!dateStr) return "";
    try {
        const date = new Date(dateStr);
        return date.toLocaleDateString("es-ES", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    } catch {
        return dateStr;
    }
};

/**
 * Formats a number as a price string in EUR.
 * @param {number} amount
 * @returns {string}
 */
export const formatPrice = (amount) => {
    if (amount == null) return "";
    return new Intl.NumberFormat("es-ES", {
        style: "currency",
        currency: "EUR",
    }).format(amount);
};

