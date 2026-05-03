import CardHorizontal from "../cards/CardHorizontal";

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

    const selectedPromo = promotions.find((promotion) => promotion.id === parseInt(selectedPromoId));
    const discount = selectedPromo && selectedPromo.discountPercentage
        ? (unitPrice * selectedPromo.discountPercentage) / 100
        : 0;

    const finalPrice = unitPrice - discount;

    return (
        <div className="commerce-panel cart-item-shell">
            <div className="commerce-stack">
                <CardHorizontal
                    id={product.id}
                    title={product.title}
                    description={product.description}
                    image={product.image}
                    detailLeft={`Precio base ${unitPrice.toFixed(2)} EUR`}
                    detailRight={`Subtotal ${(finalPrice * quantity).toFixed(2)} EUR`}
                />

                {promotions.length > 0 && (
                    <div className="cart-item-meta">
                        <label htmlFor={`promo-${product.id}`}>Promocion aplicada</label>
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
        </div>
    );
}

export default CartItem;
