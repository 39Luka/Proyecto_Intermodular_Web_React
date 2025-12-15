import CardBase from "./CardBase";

function CardHorizontal({ id, title, image, quantity, subtotal, onNavigate }) {
    return (
        <CardBase
            id={id}
            title={title}
            image={image}
            onNavigate={onNavigate}
            className="card-horizontal"
        >
            <p>Cantidad: {quantity ?? "—"}</p>
            <p>Subtotal: {subtotal ?? "—"}</p>
        </CardBase>
    );
}


export default CardHorizontal;