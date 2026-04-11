function ProductActionCard({ product, onAddToCart }) {
    const { price, stock } = product;
    const isOutOfStock = stock <= 0;

    return (
        <div className="product-detail__actions">
            <div className="product-detail__price">
                <span className="price-label">Precio</span>
                <span className="price-value">{price?.toFixed(2) || "0.00"}€</span>
            </div>

            <div className="product-detail__stock">
                <span className="stock-label">Stock</span>
                <span className="stock-value">{!isOutOfStock ? stock : "Agotado"}</span>
            </div>

            <button 
                className="product-detail__add-to-cart" 
                onClick={onAddToCart}
                disabled={isOutOfStock}
            >
                {!isOutOfStock ? "Añadir al carrito" : "Agotado"}
            </button>
        </div>
    );
}

export default ProductActionCard;
