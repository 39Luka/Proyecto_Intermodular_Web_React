import ProductList from "./ProductList";
import SectionBase from "./SectionBase";

function ProductSection({ title, products, page = "products", CardComponent }) {


    return (
        <>
            <SectionBase title={title}>
                <div className="cards-container">
                    <ProductList products={products} page={page} CardComponent={CardComponent} />
                </div>
            </SectionBase>
        </>
    )
}

export default ProductSection;