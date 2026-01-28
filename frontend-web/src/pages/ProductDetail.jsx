
import slugify from "slugify";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useProduct } from "../hooks/useProducts";

function ProductDetail() {

  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const initialData = location.state?.product;
  const { product, loading, error } = useProduct(id, initialData);

  if (loading) return <div style={{ textAlign: "center", padding: "4rem" }}>Cargando...</div>;
  if (error) return <div style={{ textAlign: "center", padding: "4rem", color: "red" }}>Error: {error}</div>;
  if (!product) return <div style={{ textAlign: "center", padding: "4rem" }}>Producto no encontrado</div>;

  const name = slugify(product.title || product.nombre, { lower: true, strict: true }) // Fallback for name property change if any

  return (
    <div className="product-detail-wrapper">
      <div className="product-detail-header">
        <button
          className="button button--text"
          onClick={() => navigate(-1)}
        >
          ← Volver atrás
        </button>
      </div>

      <article className="product-detail" aria-labelledby={`title-${name}`}>
        <figure className="product-detail__figure">
          <img
            className="product-detail__image"
            src={product.image}
            alt={`Imagen de ${product.title}`}
          />
        </figure>

        <div className="product-detail__content">
          <header>
            <h2 className="product-detail__title" id={`title-${name}`}>{product.title}</h2>
            <div className="product-detail__badges">
              {/* Example cosmetic badge */}
              <span className="badge">Novedad</span>
            </div>
          </header>

          <p className="product-detail__description">{product.description}</p>

          <div className="product-detail__divider"></div>

          <div className="product-detail__actions">
            <div className="product-detail__price">
              <span className="price-label">Precio</span>
              <span className="price-value">{product.price?.toFixed(2) || "0.00"}€</span>
            </div>

            <div className="product-detail__stock">
              <span className="stock-label">Stock</span>
              <span className="stock-value">{product.stock > 0 ? product.stock : "Agotado"}</span>
            </div>

            <button className="product-detail__add-to-cart">
              Añadir al carrito
            </button>
          </div>
        </div>
      </article>
    </div>
  )
}

export default ProductDetail;