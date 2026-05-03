import slugify from "slugify";
import { DEFAULT_PRODUCT_IMAGE } from "../../utils/mappers";

function CardVertical({ id, title, image, description, price, category, onNavigate }) {
    const slug = slugify(title || "producto", { lower: true, strict: true });
    const safeImage = image || DEFAULT_PRODUCT_IMAGE;

    const handleOnClick = () => onNavigate?.(id);
    const handleOnKeyUp = (event) => {
        if (event.key === "Enter" || event.key === " ") onNavigate?.(id);
    };

    const isClickable = Boolean(onNavigate);

    return (
        <article
            className={`card-vertical ${!isClickable ? "card--static" : ""}`.trim()}
            id={slug}
            role={isClickable ? "button" : undefined}
            tabIndex={isClickable ? 0 : undefined}
            onClick={isClickable ? handleOnClick : undefined}
            onKeyUp={isClickable ? handleOnKeyUp : undefined}
            aria-labelledby={`title-${slug}`}
            aria-describedby={`desc-${slug}`}
        >
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
                    <span className="card__action">Ver detalle</span>
                </div>
            </div>
        </article>
    );
}

export default CardVertical;
