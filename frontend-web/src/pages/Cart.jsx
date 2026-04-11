import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { purchaseService } from "../services/purchaseService";
import { promotionService } from "../services/promotionService";
import { useState, useEffect } from "react";
import CartItem from "../components/cart/CartItem";
import CartSummary from "../components/cart/CartSummary";

function Cart() {
    const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const [availablePromotions, setAvailablePromotions] = useState({});
    const [selectedPromotions, setSelectedPromotions] = useState({});

    // Fetch promotions for items in cart
    useEffect(() => {
        const fetchPromos = async () => {
            const newPromos = {};
            for (const item of cartItems) {
                if (availablePromotions[item.product.id] === undefined) {
                    try {
                        const promos = await promotionService.getActivePromotions(item.product.id);
                        newPromos[item.product.id] = promos;
                    } catch (e) {
                        console.error("Failed fetching promos for", item.product.id);
                        newPromos[item.product.id] = [];
                    }
                }
            }
            if (Object.keys(newPromos).length > 0) {
                setAvailablePromotions(prev => ({ ...prev, ...newPromos }));
            }
        };
        if (cartItems.length > 0) fetchPromos();
    }, [cartItems, availablePromotions]);

    const handlePromoSelect = (productId, promoId) => {
        setSelectedPromotions(prev => ({
            ...prev,
            [productId]: promoId !== "" ? parseInt(promoId) : null
        }));
    };

    const getDiscountValue = (productId, originalPrice) => {
        const promoId = selectedPromotions[productId];
        if (!promoId) return 0;
        const promos = availablePromotions[productId];
        const selectedPromo = promos?.find(p => p.id === parseInt(promoId));
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
            const itemsToBuy = cartItems.map(item => ({
                productId: item.product.id,
                quantity: item.quantity,
                promotionId: selectedPromotions[item.product.id] || null
            }));
            
            await purchaseService.createPurchase(itemsToBuy);
            clearCart();
            navigate("/purchased");
        } catch (err) {
            console.error("Checkout failed:", err);
            setError(err.message || "Error al procesar la compra");
        } finally {
            setIsProcessing(false);
        }
    };

    if (cartItems.length === 0) {
        return (
            <div className="empty-state">
                <h2>Mi Carrito</h2>
                <p>Tu carrito está vacío.</p>
                <button className="button" onClick={() => navigate("/products")}>
                    Ir al Catálogo
                </button>
            </div>
        );
    }

    return (
        <div className="cart-container p-2 container-narrow">
            <div className="cart-header flex flex-between items-center mb-2">
                <h2>Mi Carrito</h2>
                <button className="button button--text" onClick={clearCart}>
                    Vaciar Carrito
                </button>
            </div>
            
            {error && <div className="text-danger mb-1">{error}</div>}

            <div className="cart-items flex flex-col gap-1">
                {cartItems.map(item => (
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
    );
}

export default Cart;