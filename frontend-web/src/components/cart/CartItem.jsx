import CardHorizontal from "../cards/CardHorizontal";

/**
 * Elemento individual dentro del carrito de la compra.
 *
 * Renderiza una `CardHorizontal` con el producto y expone controles para:
 * - Seleccionar una promoción aplicable (descuento por porcentaje).
 * - Modificar la cantidad, respetando el stock disponible.
 * - Eliminar el producto del carrito.
 *
 * El subtotal se recalcula automáticamente al cambiar la promoción o la cantidad.
 *
 * @component
 * @param {Object}   props
 * @param {{ product: Object, quantity: number }} props.item
 *   - `product`: Objeto producto con al menos `id`, `title`, `description`, `image`, `price` y `stock`.
 *   - `quantity`: Cantidad actual en el carrito.
 * @param {Array<{ id:number, title:string, discountPercentage:number }>} [props.promotions=[]]
 *   Lista de promociones disponibles para el producto.
 * @param {number|string} [props.selectedPromoId]  - ID de la promoción seleccionada actualmente.
 * @param {Function} props.onPromoChange            - `(productId, promoId) => void` al cambiar la promoción.
 * @param {Function} props.onQuantityChange         - `(productId, quantity) => void` al cambiar la cantidad.
 * @param {Function} props.onRemove                 - `(productId) => void` al eliminar el producto.
 * @returns {JSX.Element} Panel de carrito con tarjeta, selector de promoción y controles de cantidad.
 *
 * @example
 * <CartItem
 *   item={{ product, quantity: 2 }}
 *   promotions={activePromotions}
 *   selectedPromoId={selectedPromos[product.id]}
 *   onPromoChange={handlePromoChange}
 *   onQuantityChange={handleQuantityChange}
 *   onRemove={handleRemove}
 * />
 */
function CartItem({

    item,
    promotions = [],
    selectedPromoId,
    onPromoChange,
    onQuantityChange,
    onRemove
}) {
    const { product, quantity } = item;
    const unitPrice = product.price || 0;

    const selectedPromo = promotions.find((promotion) => String(promotion.id) === String(selectedPromoId));
    const discount = selectedPromo && selectedPromo.discountPercentage
        ? (unitPrice * selectedPromo.discountPercentage) / 100
        : 0;

    const finalPrice = unitPrice - discount;

    return (
        <li className="commerce-panel cart-item-shell">
            <div className="commerce-stack">
                <CardHorizontal
                    id={product.id}
                    title={product.title}
                    description={product.description}
                    image={product.image}
                    detailLeft={`Precio base ${unitPrice.toFixed(2)} EUR`}
                    detailRight={`Subtotal ${(finalPrice * quantity).toFixed(2)} EUR`}
                    className="card-horizontal--cart"
                />

                {promotions.length > 0 && (
                    <div className="cart-item-meta">
                        <label htmlFor={`promo-${product.id}`}>Promoción aplicada</label>
                        <select
                            id={`promo-${product.id}`}
                            value={selectedPromoId || ""}
                            onChange={(event) => onPromoChange(product.id, event.target.value)}
                            className="form-select"
                        >
                            <option value="">No aplicar promocion</option>
                            {promotions.map((promotion) => (
                                <option key={promotion.id} value={promotion.id}>
                                    {promotion.title} {promotion.discountPercentage ? `(-${promotion.discountPercentage}%)` : ""}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
            </div>

            <div className="cart-item-controls">
                <input
                    type="number"
                    min="1"
                    max={product.stock || undefined}
                    value={quantity}
                    onChange={(event) => onQuantityChange(product.id, parseInt(event.target.value) || 1)}
                    className="form-input w-60"
                    aria-label={`Cantidad de ${product.title}`}
                />
                <button
                    onClick={() => onRemove(product.id)}
                    className="button button--secondary"
                >
                    Eliminar
                </button>
            </div>
        </li>
    );
}

export default CartItem;
