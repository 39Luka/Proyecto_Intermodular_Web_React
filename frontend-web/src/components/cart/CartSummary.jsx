function CartSummary({ total, onCheckout, isProcessing }) {
    return (
        <div className="cart-summary mt-2 p-1 border-t text-right">
            <h3>Total a pagar: {total.toFixed(2)}€</h3>
            <button 
                className="button button--success mt-1" 
                onClick={onCheckout} 
                disabled={isProcessing}
            >
                {isProcessing ? "Procesando..." : "Finalizar Compra"}
            </button>
        </div>
    );
}

export default CartSummary;
