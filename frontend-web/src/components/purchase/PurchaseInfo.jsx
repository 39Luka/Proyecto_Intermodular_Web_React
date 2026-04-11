import { formatStatus } from "../../utils/formatters";

function PurchaseInfo({ purchase, details, onPay, onCancel }) {
    const formattedDate = new Date(purchase.title).toLocaleDateString() || purchase.title;
    const total = details.reduce((acc, item) => acc + (item.subtotal || 0), 0);
    const isPending = purchase.description.includes("CREATED");

    return (
        <section className="purchase-info">
            <h2 className="section-title">Información General</h2>
            <div className="info-card">
                <div className="info-row">
                    <span className="label">Fecha:</span>
                    <span className="value">{formattedDate}</span>
                </div>
                <div className="info-row">
                    <span className="label">Estado:</span>
                    <span className={`status-badge ${isPending ? "pending" : "completed"}`}>
                        {formatStatus(purchase.description.replace("Estado: ", ""))}
                    </span>
                </div>
                <div className="info-row total-row">
                    <span className="label">Total:</span>
                    <span className="value">
                        {total.toFixed(2)}€
                    </span>
                </div>
                
                {isPending && (
                    <div className="purchase-actions mt-1 flex flex-col gap-1">
                        <button 
                            className="button button--success" 
                            onClick={onPay}
                        >
                            Pagar Compra
                        </button>
                        <button 
                            className="button button--danger" 
                            onClick={onCancel}
                        >
                            Cancelar Compra
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
}

export default PurchaseInfo;
