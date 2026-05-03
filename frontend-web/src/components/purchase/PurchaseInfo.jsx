import { formatDate, formatStatus } from "../../utils/formatters";

function PurchaseInfo({ purchase, details, onPay, onCancel }) {
    const formattedDate = purchase.createdAt ? formatDate(purchase.createdAt) : purchase.title;
    const total = details.reduce((acc, item) => acc + (item.subtotal || 0), 0);
    const isPending = purchase.status === "CREATED" || purchase.description.includes("Creada");

    return (
        <section className="purchase-info">
            <h2 className="section-title">Informacion general</h2>
            <div className="info-card">
                <div className="info-row">
                    <span className="label">Fecha</span>
                    <span className="value">{formattedDate}</span>
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
