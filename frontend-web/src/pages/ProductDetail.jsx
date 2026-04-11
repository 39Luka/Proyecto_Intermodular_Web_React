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

  const name = slugify(product.title || product.nombre, { lower: true, strict: true })

  const handleAddToCart = () => {
    addToCart(product, 1);
    navigate("/cart");
  };

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
              <span className="badge">Novedad</span>
            </div>
          </header>

          <p className="product-detail__description">{product.description}</p>

          <div className="product-detail__divider"></div>

          <ProductActionCard 
            product={product} 
            onAddToCart={handleAddToCart} 
          />
        </div>
      </article>
    </div>
  )
}

export default ProductDetail;