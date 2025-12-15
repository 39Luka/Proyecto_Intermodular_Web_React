import slugify from "slugify";

function CardBase({ id, title, image, onNavigate, children, className = "" }) {

    const slug = id ?? slugify(title || "producto", { lower: true, strict: true });

    const handleOnClick = () => onNavigate?.(id);

    const handleOnKeyUp = (e) => {
        if (e.key === "Enter" || e.key === " ") onNavigate?.(id);
    };


    return (
        <article
            className={`card ${className}`}
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

                {children}

            </div>

        </article>

    );

}

export default CardBase;