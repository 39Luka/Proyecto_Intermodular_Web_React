import ProductSection from "../components/ProductSection";
import { mockProducts } from "../data/mockProducts";

function Products() {
    return (
        <>
        <ProductSection title="Productos" products={mockProducts} page="products"/>

        </>
    )
}

export default Products;