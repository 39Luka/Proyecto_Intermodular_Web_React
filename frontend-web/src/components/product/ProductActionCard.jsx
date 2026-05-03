function ProductActionCard({ product, onAddToCart }) {
    const { price, stock, category } = product;
    const isOutOfStock = stock <= 0;

    return (
        <div className="product-detail__actions">
            <div className="product-detail__stats">
                <div className="product-detail__stat">
                    <span className="price-label">Precio</span>
                    <span className="price-value">{price?.toFixed(2) || "0.00"} EUR</span>
                </div>

                <div className="product-detail__stat">
                    <span className="stock-label">Disponibilidad</span>
                    <span className="stock-value">{!isOutOfStock ? `${stock} unidades` : "Agotado"}</span>
                </div>
            </div>

            <div className="product-detail__purchase-card">
                <p className="product-detail__purchase-eyebrow">{category?.name || "Seleccion del obrador"}</p>
                <button
                    className="product-detail__add-to-cart"
                    onClick={onAddToCart}
                    disabled={isOutOfStock}
                >
                    {!isOutOfStock ? "Anadir al carrito" : "Agotado"}
                </button>
            </div>
        </div>
    );
}

export default ProductActionCard;
