import CardHorizontal from "../cards/CardHorizontal";

function PurchaseLines({ details, productsMap, onNavigate }) {
    const cardItems = details.map((line) => {
        const product = productsMap[line.productId];
        const unitPrice = line.subtotal / line.quantity;

        return {
            id: line.productId,
            title: line.title || `Producto #${line.productId}`,
            description: product?.description || "",
            image: product?.image || "",
            detailLeft: `Cantidad ${line.quantity} x ${unitPrice.toFixed(2)} EUR`,
            detailRight: `${line.subtotal?.toFixed(2) || "0.00"} EUR`
        };
    });

    return (
        <section className="purchase-lines">
            <h2 className="section-title">Productos incluidos</h2>
            {details.length === 0 ? (
                <div className="empty-state">No hay productos en esta compra.</div>
            ) : (
                <div className="commerce-stack">
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
