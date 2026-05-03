function CartSummary({ total, onCheckout, isProcessing }) {
    return (
        <div className="commerce-panel cart-summary">
            <p className="cart-summary__label">Total final</p>
            <h3 className="cart-summary__total">{total.toFixed(2)} EUR</h3>
            <button
                className="button button--primary"
                onClick={onCheckout}
                disabled={isProcessing}
            >
                {isProcessing ? "Procesando..." : "Finalizar compra"}
            </button>
        </div>
    );
}

export default CartSummary;
