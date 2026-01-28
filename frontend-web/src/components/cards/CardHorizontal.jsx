import slugify from "slugify";

function CardHorizontal({ id, title, image, description, detailLeft, detailRight, onNavigate }) {
    const slug = slugify(title || "producto", { lower: true, strict: true });

    const handleOnClick = () => onNavigate?.(id);
    const handleOnKeyUp = (e) => {
        if (e.key === "Enter" || e.key === " ") onNavigate?.(id);
    };

    const isClickable = Boolean(onNavigate);

    return (
        <article
            className={`card-horizontal ${!isClickable ? "card--static" : ""}`}
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
                    {detailLeft && <p className="card__text-left">{detailLeft}</p>}
                    {detailRight && <p className="card__text-right">{detailRight}</p>}
                </div>
            </div>

            {image && (
                <figure className="card__figure">
                    <img className="card__image" src={image} alt={`Imagen de ${title} `} />
                </figure>
            )}
        </article>
    );
}

export default CardHorizontal;