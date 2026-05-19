/**
 * Panel de resumen del carrito con el total y botón de finalización.
 *
 * Muestra el importe total calculado y un botón para iniciar el proceso de pago.
 * El botón se deshabilita automáticamente mientras se procesa la compra.
 *
 * @component
 * @param {Object}   props
 * @param {number}   props.total          - Importe total de la compra en EUR.
 * @param {Function} props.onCheckout     - Callback invocado al pulsar "Finalizar compra".
 * @param {boolean}  props.isProcessing   - Cuando `true`, deshabilita el botón y muestra "Procesando...".
 * @returns {JSX.Element} Panel con total y botón de pago.
 *
 * @example
 * <CartSummary
 *   total={cartTotal}
 *   onCheckout={handleCheckout}
 *   isProcessing={isLoading}
 * />
 */
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
