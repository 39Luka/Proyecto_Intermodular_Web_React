import ProductList from "./ProductList";
import SectionBase from "./SectionBase";

function ProductSection({
    title,
    products,
    page = "products",
    CardComponent,
    eyebrow,
    description,
    emptyVariant = "",
    emptyTitle = "Sin elementos por ahora.",
    emptyDescription = "Volvera a mostrarse contenido aqui en cuanto este disponible.",
    onNavigate
}) {
    const hasProducts = Array.isArray(products) && products.length > 0;

    return (
        <SectionBase title={title} eyebrow={eyebrow} description={description}>
            {hasProducts ? (
                <div className="cards-container">
                    <ProductList products={products} page={page} CardComponent={CardComponent} onNavigate={onNavigate} />
                </div>
            ) : (
                <div className="empty-state-wrap">
                    <div className={`empty-state empty-state--subtle ${emptyVariant}`.trim()}>
                        <p className="empty-state__title">{emptyTitle}</p>
                        <p className="empty-state__description">{emptyDescription}</p>
                    </div>
                </div>
            )}
        </SectionBase>
    );
}

export default ProductSection;
