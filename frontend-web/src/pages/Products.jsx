import CardVertical from "../components/cards/CardVertical";
import ProductSection from "../components/sections/ProductSection";
import { mockProducts } from "../data/mockProducts";

function Products() {
    return (
        <>
        <ProductSection title="Productos" products={mockProducts} CardComponent={CardVertical}/>

        </>
    )
}

export default Products;