import ProductSection from "../components/ProductSection";
import { mockProducts } from "../data/mockProducts";
function Cart(){
    return(
         <>
            <ProductSection
                title="Home"
                products={mockProducts}
                page="products"
                variant="horizontal"
                options={{
                    limit: 8
                }} />
        </>
    )
}
export default Cart;