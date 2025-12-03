import ProductSection from "../components/ProductSection";
import { mockProducts } from "../data/mockProducts";

function Products() {
    return (
        <>
        <ProductSection title="Products" products={mockProducts} page="products"/>

        </>
    )
}

export default Products;