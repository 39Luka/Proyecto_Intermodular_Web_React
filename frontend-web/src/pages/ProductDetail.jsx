import slugify from "slugify";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useProduct } from "../hooks/useProducts";
import { useCart } from "../context/CartContext";
import ProductActionCard from "../components/product/ProductActionCard";

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const initialData = location.state?.product;
  const { product, loading, error } = useProduct(id, initialData);
  const { addToCart } = useCart();

  if (loading) return <div className="status-message">Cargando...</div>;
  if (error) return <div className="status-message status-message--error">Error: {error}</div>;
  if (!product) return <div className="status-message">Producto no encontrado</div>;

  const name = slugify(product.title || product.nombre, { lower: true, strict: true });

  const handleAddToCart = (quantity) => {
    addToCart(product, quantity);
    navigate("/cart");
  };

  return (
    <div className="product-detail-wrapper">
      <div className="product-detail-header">
        <button className="button button--secondary" onClick={() => navigate(-1)}>
          ← Volver
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
          <header className="product-detail__copy">
            <p className="product-detail__eyebrow">{product.category?.name || "Pieza destacada"}</p>
            <h2 className="product-detail__title" id={`title-${name}`}>{product.title}</h2>
            <div className="product-detail__badges">
              <span className="badge">Recien preparado</span>
            </div>
          </header>

          <p className="product-detail__description">{product.description}</p>

          <ProductActionCard product={product} onAddToCart={handleAddToCart} />
        </div>
      </article>
    </div>
  );
}

export default ProductDetail;
