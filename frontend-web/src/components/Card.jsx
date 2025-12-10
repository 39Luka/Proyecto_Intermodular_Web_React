import slugify from "slugify";

function Card({
    id,
    title,
    image,
    description,
    onNavigate,
    variant = "default",  
    quantity,
    subtotal
}) {

    const slug = slugify(title || "producto", { lower: true, strict: true });

    const handleOnClick = () => onNavigate?.(id);

    const handleOnKeyUp = (e) => {
        if (e.key === "Enter" || e.key === " ") onNavigate?.(id);
    };

    const isHorizontal = variant === "horizontal";

    return (
        <article
    className={`card ${isHorizontal ? "card-horizontal" : ""}`}
    id={slug}
    role="button"
    tabIndex={0}
    onClick={handleOnClick}
    onKeyUp={handleOnKeyUp}
    aria-labelledby={`title-${slug}`}
    aria-describedby={`desc-${slug}`}
>

    <figure>
        <img src={image} alt={`Imagen de ${title}`} />
    </figure>

    <div className="content">
        <h3 id={`title-${slug}`}>{title}</h3>

        {isHorizontal ? (
            <>
                <p>Cantidad: {quantity ?? "—"}</p>
                <p>Subtotal: {subtotal ?? "—"}</p>
            </>
        ) : (
            <p id={`desc-${slug}`}>{description}</p>
        )}
    </div>

</article>

    );
}

export default Card;
