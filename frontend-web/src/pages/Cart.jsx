import CardHorizontal from "../components/CardHorizontal";
import ProductSection from "../components/ProductSection";
import { mockProducts } from "../data/mockProducts";
function Cart(){
    return(
         <>
            <ProductSection
                title="Home"
                products={mockProducts}
                page="products"
                CardComponent={CardHorizontal}
                options={{
                    limit: 8
                }} />
        </>
    )
}
export default Cart;