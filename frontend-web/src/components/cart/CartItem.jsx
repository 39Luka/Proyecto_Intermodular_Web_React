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

    // Calculate discount locally for display
    const selectedPromo = promotions.find(p => p.id === parseInt(selectedPromoId));
    const discount = selectedPromo && selectedPromo.discountPercentage 
        ? (unitPrice * selectedPromo.discountPercentage) / 100 
        : 0;
    
    const finalPrice = unitPrice - discount;

    return (
        <div className="flex items-center gap-1">
            <div className="flex-1">
                <CardHorizontal
                    id={product.id}
                    title={product.title}
                    description={product.description}
                    image={product.image}
                    detailLeft={`Precio base: ${unitPrice.toFixed(2)}€`}
                    detailRight={`Subtotal: ${(finalPrice * quantity).toFixed(2)}€ ${discount > 0 ? '(Descuento aplicado)' : ''}`}
                />
                
                {promotions.length > 0 && (
                    <div className="mt-05 pl-1">
                        <label 
                            htmlFor={`promo-${product.id}`} 
                            className="text-small text-muted"
                        >
                            Promoción: 
                        </label>
                        <select 
                            id={`promo-${product.id}`}
                            value={selectedPromoId || ""}
                            onChange={(e) => onPromoChange(product.id, e.target.value)}
                            className="form-select"
                        >
                            <option value="">No aplicar promoción</option>
                            {promotions.map(promo => (
                                <option key={promo.id} value={promo.id}>
                                    {promo.title} {promo.discountPercentage ? `(-${promo.discountPercentage}%)` : ""}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
            </div>

            <div className="cart-item-controls flex flex-col gap-05">
                <input 
                    type="number" 
                    min="1" 
                    value={quantity} 
                    onChange={(e) => onQuantityChange(product.id, parseInt(e.target.value) || 1)}
                    className="form-input w-60"
                />
                <button 
                    onClick={() => onRemove(product.id)} 
                    className="button button--danger"
                >
                    Eliminar
                </button>
            </div>
        </div>
    );
}

export default CartItem;
