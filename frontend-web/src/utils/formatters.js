/**
 * Mapea los valores de estado de compra de la API a etiquetas en español.
 * Valores de estado de la API: CREATED, PAID, CANCELLED
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
 * Formatea una cadena de fecha ISO o una cadena de fecha a un formato legible por humanos.
 * @param {string} dateStr - Cadena de fecha ISO (ej. "2025-03-15" o "2025-03-15T10:30:00")
 * @returns {string}
 */
export const formatDate = (dateStr) => {
    if (!dateStr) return "";
    try {
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) {
            return dateStr;
        }
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
 * Formatea un número como una cadena de precio en EUR.
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

