/**
 * Formats a status string by replacing underscores with spaces.
 * Example: "PENDING_PAYMENT" -> "PENDING PAYMENT"
 * @param {string} status - The status string to format.
 * @returns {string} - The formatted string.
 */
export const formatStatus = (status) => {
    if (!status) return "";
    return status.replace(/_/g, " ");
};
