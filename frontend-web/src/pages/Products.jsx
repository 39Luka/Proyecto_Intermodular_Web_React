import CardVertical from "../components/CardVertical";
import ProductSection from "../components/ProductSection";
import { mockProducts } from "../data/mockProducts";

function Products() {
    return (
        <>
        <ProductSection title="Productos" products={mockProducts} CardComponent={CardVertical}/>

        </>
    )
}

export default Products;