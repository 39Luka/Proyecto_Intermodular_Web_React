/**
 * Tarjeta de producto en formato vertical.
 * Soporta navegación y marcado visual de producto agotado.
 *
 * @component
 * @param {Object}   props
 * @param {number|string} props.id        - Identificador único del producto.
 * @param {string}   props.title          - Nombre del producto.
 * @param {string}   [props.image]        - URL o base64 de la imagen. Fallback a la imagen por defecto.
 * @param {string}   [props.description]  - Descripción breve del producto.
 * @param {number}   [props.price]        - Precio unitario en EUR.
 * @param {{name:string}} [props.category]- Objeto categoría con al menos `name`.
 * @param {number}   [props.stock]        - Stock disponible. `0` muestra la tarjeta como agotada.
 * @param {Function} [props.onNavigate]   - Callback `(id) => void` al seleccionar la tarjeta.
 * @returns {JSX.Element} Artículo HTML semántico con imagen y detalles del producto.
 *
 * @example
 * <CardVertical
 *   id={product.id}
 *   title={product.title}
 *   image={product.image}
 *   description={product.description}
 *   price={product.price}
 *   category={product.category}
 *   stock={product.stock}
 *   onNavigate={(id) => navigate(`/products/${id}`)}
 * />
 */
import slugify from "slugify";
import { DEFAULT_PRODUCT_IMAGE } from "../../utils/mappers";

function CardVertical({ id, title, image, description, price, category, stock, onNavigate }) {
    const slug = slugify(title || "producto", { lower: true, strict: true });
    const safeImage = image || DEFAULT_PRODUCT_IMAGE;

    const isOutOfStock = stock === 0;
    const handleOnClick = () => !isOutOfStock && onNavigate?.(id);
    const handleOnKeyUp = (event) => {
        if (!isOutOfStock && (event.key === "Enter" || event.key === " ")) onNavigate?.(id);
    };

    const isClickable = Boolean(onNavigate) && !isOutOfStock;

    return (
        <article
            className={`card-vertical ${!isClickable ? "card--static" : ""} ${isOutOfStock ? "card--out-of-stock" : ""}`.trim()}
            id={slug}
            role={isClickable ? "button" : undefined}
            tabIndex={isClickable ? 0 : undefined}
            onClick={isClickable ? handleOnClick : undefined}
            onKeyUp={isClickable ? handleOnKeyUp : undefined}
            aria-labelledby={`title-${slug}`}
            aria-describedby={`desc-${slug}`}
        >
            {isOutOfStock && <div className="card__ribbon">Agotado</div>}
            <figure className="card__figure">
                <img
                    className="card__image"
                    src={safeImage}
                    alt={`Imagen de ${title}`}
                    onError={(event) => {
                        event.currentTarget.onerror = null;
                        event.currentTarget.src = DEFAULT_PRODUCT_IMAGE;
                    }}
                />
            </figure>

            <div className="card__content">
                <p className="card__eyebrow">{category?.name || "Obrador diario"}</p>
                <h3 className="card__title" id={`title-${slug}`}>{title}</h3>
                <p className="card__description" id={`desc-${slug}`}>{description}</p>
                <div className="card__meta">
                    <span className="card__price">{price != null ? `${price.toFixed(2)} EUR` : "Fresco hoy"}</span>
                    <span className="card__action">{isOutOfStock ? "No disponible" : "Ver detalle"}</span>
                </div>
            </div>
        </article>
    );
}

export default CardVertical;
