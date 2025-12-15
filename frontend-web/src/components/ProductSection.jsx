import ProductList from "./ProductList";
import SectionBase from "./SectionBase";

function ProductSection({ title, products, page = "products", options, CardComponent}) {


    return (
        <>
        <SectionBase title={title}>
            <div className="cards-container">
                    <ProductList products={products} options={options} page={page} CardComponent={CardComponent}/>
            </div>
        </SectionBase>
        </>
    )
}

export default ProductSection;