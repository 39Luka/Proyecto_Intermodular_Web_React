import slugify from "slugify";
import { mockProducts } from "../data/mockProducts";
import { useParams } from "react-router-dom";

function ProductDetail() {

    const { id } = useParams();
    const product = mockProducts.find((product) => product.id === Number(id))
    const name = slugify(product.title, { lower: true, strict: true })

    return (
        <>
            <article className="product-detail" aria-labelledby={`title-${name}`}>
                {/* Contenedor del texto y botones */}
                <div className="content">
                    <header>
                        <h2 id={`title-${name}`}>{product.title}</h2>
                    </header>

                    <p>{product.description}</p>

                    <p><strong>Precio: </strong>{product.price.toFixed(2)}€</p>

                    <p><strong>Stock: </strong>{product.stock > 0 ? `${product.stock} unidades` : "Sin stock"}</p>

                    <button type="button">
                        Añadir al carrito
                    </button>
                </div>

                {/* Imagen */}
                <figure>
                    <img
                        src={product.image}
                        alt={`Imagen de ${product.title}`}
                    />
                    <figcaption>{product.title}</figcaption>
                </figure>
            </article>

        </>
    )
}

export default ProductDetail;