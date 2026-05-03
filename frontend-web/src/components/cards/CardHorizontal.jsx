import slugify from "slugify";
import { DEFAULT_PRODUCT_IMAGE } from "../../utils/mappers";

function CardHorizontal({ id, title, image, description, price, category, detailLeft, detailRight, onNavigate, actions, className = "" }) {
    const slug = slugify(title || "producto", { lower: true, strict: true });
    const safeImage = image || DEFAULT_PRODUCT_IMAGE;

    const handleOnClick = () => onNavigate?.(id);
    const handleOnKeyUp = (e) => {
        if (e.key === "Enter" || e.key === " ") onNavigate?.(id);
    };

    const isClickable = Boolean(onNavigate);

    // Si no vienen detalles explícitos, usamos categoría y precio para que coincida con la vertical
    const displayLeft = detailLeft || category?.name || "Obrador";
    const displayRight = detailRight || (price != null ? `${price.toFixed(2)}€` : null);

    return (
        <article
            className={`card-horizontal ${!isClickable ? "card--static" : ""} ${className}`.trim()}
            id={slug}
            role={isClickable ? "button" : undefined}
            tabIndex={isClickable ? 0 : undefined}
            onClick={isClickable ? handleOnClick : undefined}
            onKeyUp={isClickable ? handleOnKeyUp : undefined}
            aria-labelledby={`title-${slug}`}
            aria-describedby={`desc-${slug}`}
        >
            <div className="card__content">
                <div className="card__header">
                    {title && <h3 className="card__title" id={`title-${slug}`}>{title}</h3>}
                    {description && <p className="card__description" id={`desc-${slug}`}>{description}</p>}
                </div>

                <div className="card__footer">
                    <div className="card__footer-content">
                        {displayLeft && <p className="card__text-left">{displayLeft}</p>}
                        {displayRight && <p className="card__text-right">{displayRight}</p>}
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
