import CardHorizontal from "../cards/CardHorizontal";

/**
 * Lista de productos incluidos en una compra.
 *
 * Mapea las líneas de detalle de la compra a tarjetas `CardHorizontal`,
 * enriqueciendo cada línea con la imagen y descripción del producto si están
 * disponibles en `productsMap`. Muestra un estado vacío cuando no hay líneas.
 *
 * @component
 * @param {Object}   props
 * @param {Array<{
 *   productId: number,
 *   title?: string,
 *   quantity: number,
 *   subtotal: number
 * }>} props.details       - Líneas de detalle de la compra.
 * @param {Object.<number, Object>} props.productsMap
 *   Mapa `{ [productId]: product }` con la información completa de cada producto.
 * @param {Function} [props.onNavigate] - Callback `(productId) => void` para navegar al detalle del producto.
 * @returns {JSX.Element} Sección con tarjetas de los productos comprados o estado vacío.
 *
 * @example
 * <PurchaseLines
 *   details={purchaseDetails}
 *   productsMap={productsMap}
 *   onNavigate={(id) => navigate(`/products/${id}`)}
 * />
 */
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
