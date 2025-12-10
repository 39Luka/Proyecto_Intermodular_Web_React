import slugify from "slugify";
import ProductList from "./ProductList";

function ProductSection({ title, products, page, options, variant}) {

    const slug = slugify(title, { lower: true, strict: true })

    return (
        <>
            <section aria-labelledby={`title-${slug}`}>
                <h2 id={`title-${slug}`}>{title}</h2>


                <div className="cards-container">
                    <ProductList products={products} options={options} page={page} variant={variant}/>
                </div>
            </section>
        </>
    )
}

export default ProductSection;