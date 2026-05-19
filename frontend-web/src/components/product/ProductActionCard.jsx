import { useState } from "react";

/**
 * Panel de acciones de compra en el detalle de producto.
 *
 * Muestra el precio, la disponibilidad (stock o "Agotado"), un selector de
 * cantidad numérico (limitado por el stock) y el botón "Añadir al carrito".
 * Si el producto está agotado el botón queda deshabilitado.
 *
 * @component
 * @param {Object}   props
 * @param {Object}   props.product                  - Objeto producto.
 * @param {number}   props.product.price             - Precio unitario en EUR.
 * @param {number}   props.product.stock             - Unidades disponibles.
 * @param {{name:string}} [props.product.category]   - Categoría del producto.
 * @param {Function} props.onAddToCart               - Callback `(quantity: number) => void` al añadir al carrito.
 * @returns {JSX.Element} Panel de precio, stock, selector de cantidad y botón de compra.
 *
 * @example
 * <ProductActionCard
 *   product={product}
 *   onAddToCart={(qty) => addToCart(product, qty)}
 * />
 */
function ProductActionCard({ product, onAddToCart }) {
    const { price, stock, category } = product;
    const [selectedQuantity, setSelectedQuantity] = useState(1);
    const isOutOfStock = stock <= 0;

    const handleQuantityChange = (e) => {
        const val = parseInt(e.target.value) || 1;
        setSelectedQuantity(Math.min(val, stock));
    };

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

            {!isOutOfStock && (
                <div className="product-detail__quantity-selector">
                    <label htmlFor="quantity">Cantidad</label>
                    <input
                        id="quantity"
                        type="number"
                        min="1"
                        max={stock}
                        value={selectedQuantity}
                        onChange={handleQuantityChange}
                        className="form-input w-80"
                    />
                </div>
            )}

            <div className="product-detail__purchase-card">
                <p className="product-detail__purchase-eyebrow">{category?.name || "Selección del obrador"}</p>
                <button
                    className="product-detail__add-to-cart"
                    onClick={() => onAddToCart(selectedQuantity)}
                    disabled={isOutOfStock}
                >
                    {!isOutOfStock ? "Añadir al carrito" : "Agotado"}
                </button>
            </div>
        </div>
    );
}

export default ProductActionCard;
