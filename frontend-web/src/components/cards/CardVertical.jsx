import slugify from "slugify";

function CardVertical({ id, title, image, description, price, category, onNavigate }) {
    const slug = slugify(title || "producto", { lower: true, strict: true });

    const handleOnClick = () => onNavigate?.(id);
    const handleOnKeyUp = (event) => {
        if (event.key === "Enter" || event.key === " ") onNavigate?.(id);
    };

    return (
        <article
            className="card-vertical"
            id={slug}
            role="button"
            tabIndex={0}
            onClick={handleOnClick}
            onKeyUp={handleOnKeyUp}
            aria-labelledby={`title-${slug}`}
            aria-describedby={`desc-${slug}`}
        >
            <figure className="card__figure">
                <img className="card__image" src={image} alt={`Imagen de ${title}`} />
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
