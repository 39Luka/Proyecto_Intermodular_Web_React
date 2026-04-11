import CardHorizontal from "../cards/CardHorizontal";

function PurchaseLines({ details, productsMap, onNavigate }) {
    // Map details to card format
    const cardItems = details.map(line => {
        const product = productsMap[line.productId];
        const unitPrice = line.subtotal / line.quantity;

        return {
            id: line.productId,
            title: line.title || `Producto #${line.productId}`,
            description: product?.description || "",
            image: product?.image || "",
            detailLeft: `Cantidad: ${line.quantity} × ${unitPrice.toFixed(2)}€`,
            detailRight: `${line.subtotal?.toFixed(2) || "0.00"}€`
        };
    });

    return (
        <section className="purchase-lines">
            <h2 className="section-title">Productos ({details.length})</h2>
            {details.length === 0 ? (
                <div className="empty-state">No hay productos en esta compra.</div>
            ) : (
                <div className="cards-container">
                    {cardItems.map((item) => (
                        <CardHorizontal
                            key={item.id}
                            id={item.id}
                            title={item.title}
                            description={item.description}
                            image={item.image}
                            detailLeft={item.detailLeft}
                            detailRight={item.detailRight}
                            onNavigate={onNavigate}
                        />
                    ))}
                </div>
            )}
        </section>
    );
}

export default PurchaseLines;
