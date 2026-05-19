import { createElement, useMemo } from "react";
import { useNavigate } from "react-router-dom";

/**
 * Lista de productos ordenada por disponibilidad.
 *
 * Renderiza dinámicamente un conjunto de tarjetas de producto del tipo `CardComponent`.
 * Ordena automáticamente los productos para que los agotados (stock = 0) aparezcan
 * al final de la lista. Gestiona la navegación al detalle de producto si no se
 * proporciona un callback `onNavigate` personalizado.
 *
 * @component
 * @param {Object}   props
 * @param {Array}    props.products         - Listado de productos a renderizar.
 * @param {string}   [props.page]           - Identificador de la página actual para inferir la ruta de navegación.
 * @param {React.ElementType} props.CardComponent - Componente de tarjeta de React a instanciar (ej: `CardVertical`, `CardHorizontal`).
 * @param {Function} [props.onNavigate]     - Callback personalizado `(id) => void` para controlar la navegación.
 * @returns {JSX.Element} Fragmento de React conteniendo las instancias de tarjeta renderizadas.
 *
 * @example
 * <ProductList
 *   products={catalogProducts}
 *   page="catalog"
 *   CardComponent={CardVertical}
 * />
 */
function ProductList({ products, page, CardComponent, onNavigate }) {
    const navigate = useNavigate();

    const handleNavigate = onNavigate || (page ? (id) => {
        const product = products.find(p => p.id === id);
        // Por defecto redirige a /products/ si viene de home o catalog, a menos que la página sea específica
        const path = (page === "home" || page === "catalog") ? "products" : page;
        navigate(`/${path}/${id}`, { state: { product } });
    } : undefined);

    const sortedProducts = useMemo(() => {
        return [...products].sort((a, b) => {
            const aStock = a.stock ?? 1;
            const bStock = b.stock ?? 1;
            if (aStock === 0 && bStock !== 0) return 1;
            if (aStock !== 0 && bStock === 0) return -1;
            return 0;
        });
    }, [products]);

    return (
        <>
            {sortedProducts.map((product) => (
                <li key={product.id}>
                    {createElement(CardComponent, {
                        id: product.id,
                        ...product,
                        onNavigate: handleNavigate,
                    })}
                </li>
            ))}
        </>
    );
}

export default ProductList;
