import { useNavigate } from 'react-router-dom'

function ProductList({ products, page, CardComponent }) {

    const navigate = useNavigate();

    const handleNavigate = page ? (id) => {
        const product = products.find(p => p.id === id);
        navigate(`/${page}/${id}`, { state: { product } });
    } : undefined;

    return (
        <>
            {products.map(product =>
                <CardComponent
                    key={product.id}
                    id={product.id}
                    {...product}
                    onNavigate={handleNavigate}
                />

            )}
        </>
    )
}

export default ProductList;