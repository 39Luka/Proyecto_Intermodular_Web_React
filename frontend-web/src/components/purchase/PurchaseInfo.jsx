import { formatDate, formatStatus } from "../../utils/formatters";

/**
 * Sección con la información general de una compra.
 *
 * Muestra la fecha, el estado (con badge de color), el total calculado a partir
 * de las líneas de detalle y, si la compra está en estado CREATED, los botones
 * para pagar o cancelar.
 *
 * @component
 * @param {Object}   props
 * @param {Object}   props.purchase           - Objeto de compra mapeado por `mapPurchase`.
 * @param {string}   [props.purchase.createdAt] - Fecha ISO de creación.
 * @param {string}   props.purchase.status    - Estado de la compra: `"CREATED"`, `"PAID"` o `"CANCELLED"`.
 * @param {string}   props.purchase.description - Descripción legible del estado.
 * @param {Array<{ subtotal: number }>} props.details - Líneas de detalle para calcular el total.
 * @param {Function} props.onPay              - Callback al pulsar "Pagar compra".
 * @param {Function} props.onCancel           - Callback al pulsar "Cancelar compra".
 * @returns {JSX.Element} Sección con información general de la compra.
 *
 * @example
 * <PurchaseInfo
 *   purchase={purchase}
 *   details={details}
 *   onPay={handlePay}
 *   onCancel={handleCancel}
 * />
 */
function PurchaseInfo({ purchase, details, onPay, onCancel }) {
    const formattedDate = purchase.createdAt ? formatDate(purchase.createdAt) : purchase.title;
    const total = details.reduce((acc, item) => acc + (item.subtotal || 0), 0);
    const isPending = purchase.status === "CREATED" || purchase.description.includes("Creada");

    return (
        <section className="purchase-info">
            <h2 className="section-title">Información general</h2>
            <div className="info-card">
                <div className="info-row">
                    <span className="label">Fecha</span>
                    <span className="value">
                        {purchase.createdAt ? (
                            <time dateTime={purchase.createdAt}>{formattedDate}</time>
                        ) : (
                            formattedDate
                        )}
                    </span>
                </div>
                <div className="info-row">
                    <span className="label">Estado</span>
                    <span className={`status-badge ${isPending ? "pending" : "completed"}`}>
                        {formatStatus(purchase.status || purchase.description.replace("Estado: ", ""))}
                    </span>
                </div>
                <div className="info-row total-row">
                    <span className="label">Total</span>
                    <span className="value">{total.toFixed(2)} EUR</span>
                </div>

                {isPending && (
                    <div className="commerce-stack">
                        <button className="button button--primary" onClick={onPay}>
                            Pagar compra
                        </button>
                        <button className="button button--secondary" onClick={onCancel}>
                            Cancelar compra
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
}

export default PurchaseInfo;
