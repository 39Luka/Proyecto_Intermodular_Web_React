import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { purchaseService } from "../services/purchaseService";
import { promotionService } from "../services/promotionService";
import { useState, useEffect } from "react";
import CartItem from "../components/cart/CartItem";
import CartSummary from "../components/cart/CartSummary";

function Cart() {
    const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();
    const { user } = useContext(AuthContext);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const [availablePromotions, setAvailablePromotions] = useState({});
    const [selectedPromotions, setSelectedPromotions] = useState({});

    useEffect(() => {
        const fetchPromos = async () => {
            const newPromos = {};
            for (const item of cartItems) {
                if (availablePromotions[item.product.id] === undefined) {
                    try {
                        const promos = await promotionService.getActivePromotions(item.product.id);
                        newPromos[item.product.id] = promos;
                    } catch {
                        newPromos[item.product.id] = [];
                    }
                }
            }
            if (Object.keys(newPromos).length > 0) {
                setAvailablePromotions((prev) => ({ ...prev, ...newPromos }));
            }
        };
        if (cartItems.length > 0) fetchPromos();
    }, [cartItems, availablePromotions]);

    const handlePromoSelect = (productId, promoId) => {
        setSelectedPromotions((prev) => ({
            ...prev,
            [productId]: promoId !== "" ? parseInt(promoId) : null
        }));
    };

    const getDiscountValue = (productId, originalPrice) => {
        const promoId = selectedPromotions[productId];
        if (!promoId) return 0;
        const promos = availablePromotions[productId];
        const selectedPromo = promos?.find((promo) => promo.id === parseInt(promoId));
        if (selectedPromo && selectedPromo.discountPercentage) {
            return (originalPrice * selectedPromo.discountPercentage) / 100;
        }
        return 0;
    };

    const finalTotal = cartItems.reduce((total, item) => {
        const unitPrice = item.product.price || 0;
        const discount = getDiscountValue(item.product.id, unitPrice);
        const finalPrice = unitPrice - discount;
        return total + (finalPrice * item.quantity);
    }, 0);

    const handleCheckout = async () => {
        if (cartItems.length === 0) return;
        setIsProcessing(true);
        setError(null);

        try {
            const itemsToBuy = cartItems.map((item) => ({
                productId: item.product.id,
                quantity: item.quantity,
                promotionId: selectedPromotions[item.product.id] || null
            }));

            // The backend requires `userId` when the authenticated user is ADMIN.
            // For regular users it is optional (resolved from the JWT), but
            // sending it is harmless and keeps the call uniform.
            const userId = user?.id ?? null;
            await purchaseService.createPurchase(itemsToBuy, userId);
            clearCart();
            navigate("/purchased");
        } catch (err) {
            setError(err.message || "Error al procesar la compra");
        } finally {
            setIsProcessing(false);
        }
    };

    if (cartItems.length === 0) {
        return (
            <div className="empty-state empty-state--quiet">
                <p className="empty-state__description">
                    Tu carrito está vacío. Cuando añadas productos aquí, podremos presentar mejor el resumen y el cierre de compra.
                </p>
                <button className="button button--secondary" onClick={() => navigate("/products")}>
                    Ir al catálogo
                </button>
            </div>
        );
    }

    return (
        <div className="commerce-page">
            <section className="page-intro">
                <p className="page-intro__eyebrow">Checkout</p>
                <h1 className="page-intro__title">Prepara tu pedido con una experiencia más clara.</h1>
                <p className="page-intro__description">
                    Ajusta cantidades, aplica promociones y revisa el total antes de finalizar la compra.
                </p>
            </section>

            <section className="commerce-stack">
                <div 
                    className="commerce-toolbar"
                    tabIndex="0"
                    role="region"
                    onClick={() => {}} 
                    onKeyUp={(e) => e.key === 'Enter' && e.target.click()}
                    aria-labelledby="title-cafe"
                    aria-describedby="desc-cafe"
                >
                    <h2 id="title-cafe">Mi carrito</h2>
                    <p id="desc-cafe" className="sr-only">Lista de productos seleccionados para compra.</p>
                    <button className="button button--secondary" onClick={clearCart}>
                        Vaciar carrito
                    </button>
                </div>

                {error && <div className="admin-error-msg">{error}</div>}

                <div className="cart-order-panel">
                    <div className="cart-items-group">
                        {cartItems.map((item) => (
                            <CartItem
                                key={item.product.id}
                                item={item}
                                promotions={availablePromotions[item.product.id]}
                                selectedPromoId={selectedPromotions[item.product.id]}
                                onPromoChange={handlePromoSelect}
                                onQuantityChange={updateQuantity}
                                onRemove={removeFromCart}
                            />
                        ))}
                    </div>

                    <CartSummary
                        total={finalTotal}
                        onCheckout={handleCheckout}
                        isProcessing={isProcessing}
                    />
                </div>
            </section>
        </div>
    );
}

export default Cart;
