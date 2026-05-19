/**
 * Tarjeta de producto en formato horizontal.
 * Soporta navegación, marcado de producto agotado y acciones personalizadas.
 *
 * @component
 * @param {Object}   props
 * @param {number|string} props.id           - Identificador único del producto.
 * @param {string}   props.title             - Nombre del producto (también genera el slug para IDs ARIA).
 * @param {string}   [props.image]           - URL o base64 de la imagen. Si falta se usa la imagen por defecto.
 * @param {string}   [props.description]     - Descripción corta del producto.
 * @param {number}   [props.price]           - Precio unitario en EUR.
 * @param {{name:string}} [props.category]   - Objeto categoría con al menos `name`.
 * @param {number}   [props.stock]           - Unidades disponibles. Si es `0` la tarjeta aparece como agotada.
 * @param {string}   [props.detailLeft]      - Texto del pie izquierdo. Por defecto: nombre de categoría.
 * @param {string}   [props.detailRight]     - Texto del pie derecho. Por defecto: precio formateado.
 * @param {Function} [props.onNavigate]      - Callback `(id) => void` al hacer clic. Si se omite la tarjeta no es clickable.
 * @param {React.ReactNode} [props.actions]  - Slot para botones de acción (ej. Editar/Eliminar). Se detiene la propagación del clic.
 * @param {string}   [props.className='']   - Clases CSS adicionales.
 * @returns {JSX.Element} Artículo HTML semántico con contenido del producto.
 *
 * @example
 * // Tarjeta básica con navegación
 * <CardHorizontal
 *   id={1}
 *   title="Croissant de mantequilla"
 *   image="/img/croissant.jpg"
 *   price={2.5}
 *   stock={10}
 *   onNavigate={(id) => navigate(`/products/${id}`)}
 * />
 *
 * @example
 * // Tarjeta estática con acciones de administrador
 * <CardHorizontal
 *   id={product.id}
 *   title={product.title}
 *   image={product.image}
 *   actions={
 *     <>
 *       <button onClick={handleEdit}>Editar</button>
 *       <button onClick={handleDelete}>Eliminar</button>
 *     </>
 *   }
 * />
 */
import slugify from "slugify";
import { DEFAULT_PRODUCT_IMAGE } from "../../utils/mappers";

function CardHorizontal({ id, title, image, description, price, category, stock, detailLeft, detailRight, onNavigate, actions, className = "" }) {
    const slug = slugify(title || "producto", { lower: true, strict: true });
    const safeImage = image || DEFAULT_PRODUCT_IMAGE;

    const isOutOfStock = stock === 0;
    const handleOnClick = () => !isOutOfStock && onNavigate?.(id);
    const handleOnKeyUp = (e) => {
        if (!isOutOfStock && (e.key === "Enter" || e.key === " ")) onNavigate?.(id);
    };

    const isClickable = Boolean(onNavigate) && !isOutOfStock;

    // Si no vienen detalles explícitos, usamos categoría y precio para que coincida con la vertical
    const displayLeft = detailLeft || category?.name || "Obrador";
    const displayRight = detailRight || (price != null ? `${price.toFixed(2)} EUR` : null);

    return (
        <article
            className={`card-horizontal ${!isClickable ? "card--static" : ""} ${isOutOfStock ? "card--out-of-stock" : ""} ${className}`.trim()}
            id={slug}
            role={isClickable ? "button" : undefined}
            tabIndex={isClickable ? 0 : undefined}
            onClick={isClickable ? handleOnClick : undefined}
            onKeyUp={isClickable ? handleOnKeyUp : undefined}
            aria-labelledby={`title-${slug}`}
            aria-describedby={`desc-${slug}`}
        >
            {isOutOfStock && <div className="card__ribbon">Agotado</div>}
            <div className="card__content">
                <div className="card__header">
                    {title && <h3 className="card__title" id={`title-${slug}`}>{title}</h3>}
                    {description && <p className="card__description" id={`desc-${slug}`}>{description}</p>}
                </div>

                <div className="card__footer">
                    <div className="card__footer-content">
                        {displayLeft && <p className="card__text-left">{displayLeft}</p>}
                        {displayRight && <p className="card__text-right">{isOutOfStock ? "No disponible" : displayRight}</p>}
                    </div>
                    {actions && <div className="card__actions" onClick={(e) => e.stopPropagation()}>{actions}</div>}
                </div>
            </div>

            {image && (
                <figure className="card__figure">
                    <img
                        className="card__image"
                        src={safeImage}
                        alt={`Imagen de ${title} `}
                        onError={(event) => {
                            event.currentTarget.onerror = null;
                            event.currentTarget.src = DEFAULT_PRODUCT_IMAGE;
                        }}
                    />
                </figure>
            )}
        </article>
    );
}


export default CardHorizontal;
