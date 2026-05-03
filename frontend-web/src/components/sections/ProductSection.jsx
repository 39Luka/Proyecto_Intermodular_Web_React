import ProductList from "./ProductList";
import SectionBase from "./SectionBase";

function ProductSection({ title, products, page = "products", CardComponent, eyebrow, description }) {
    return (
        <SectionBase title={title} eyebrow={eyebrow} description={description}>
            <div className="cards-container">
                <ProductList products={products} page={page} CardComponent={CardComponent} />
            </div>
        </SectionBase>
    );
}

export default ProductSection;
