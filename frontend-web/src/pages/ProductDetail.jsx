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
  {/* Imagen */}
  <figure>
    <img
      src={product.image}
      alt={`Imagen de ${product.title}`}
    />
  </figure>

  {/* Contenedor del texto y botón */}
  <div className="content">
    <header>
      <h2 id={`title-${name}`}>{product.title}</h2>
    </header>

    <p className="description">{product.description}</p>

    <div className="product-info">
      <p><strong>Precio:</strong> {product.price.toFixed(2)}€</p>
      <p><strong>Stock:</strong> {product.stock > 0 ? product.stock : "0"}</p>
    </div>

    <button className="add-to-cart">
      Añadir al carrito
    </button>
  </div>
</article>


        </>
    )
}

export default ProductDetail;