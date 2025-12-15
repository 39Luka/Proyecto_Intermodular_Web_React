import CardBase from "./CardBase";

function CardVertical({ id, title, image, description, onNavigate }) {
    return (
        <CardBase
            id={id}
            title={title}
            image={image}
            onNavigate={onNavigate}
            className="card-vertical"
        >
           { (slug) => <p id={`desc-${slug}`}>{description}</p>}
        </CardBase>
    );
}

export default CardVertical;
