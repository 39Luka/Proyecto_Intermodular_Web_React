import { createElement } from "react";
import { useNavigate } from "react-router-dom";

function ProductList({ products, page, CardComponent, onNavigate }) {
    const navigate = useNavigate();

    const handleNavigate = onNavigate || (page ? (id) => {
        const product = products.find(p => p.id === id);
        // Default to /products/ if it's from home or catalog, unless page is specific
        const path = (page === "home" || page === "catalog") ? "products" : page;
        navigate(`/${path}/${id}`, { state: { product } });
    } : undefined);

    return (
        <>
            {products.map((product) =>
                createElement(CardComponent, {
                    key: product.id,
                    id: product.id,
                    ...product,
                    onNavigate: handleNavigate,
                })
            )}
        </>
    );
}

export default ProductList;
