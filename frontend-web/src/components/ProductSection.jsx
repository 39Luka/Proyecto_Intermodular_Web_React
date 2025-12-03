import slugify from "slugify";
import ProductList from "./ProductList";

function ProductSection({title, products, page, options}) {
  
    const slug = slugify(title, {lower: true, strict: true})
  
    return (
        <>
        <section aria-labelledby={`title-${slug}`}>
            <h2 id={`title-${slug}`}>{title}</h2>

            <ProductList products={products} options={options} page={page}/>

        </section>
        </>
    )
}

export default ProductSection;