import CardHorizontal from "../components/cards/CardHorizontal";
import ProductSection from "../components/sections/ProductSection";
import { mockProducts } from "../data/mockProducts";
function Cart() {
    return (
        <>
            <ProductSection
                title="Mi Carrito"
                products={mockProducts.map(p => ({
                    ...p,
                    detailLeft: `1 ud`, // Mocking selected quantity
                    detailRight: `${p.price} €`
                }))}
                page="products"
                CardComponent={CardHorizontal}
            />
        </>
    )
}
export default Cart;