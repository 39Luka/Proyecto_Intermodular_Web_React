import ProductSection from "../components/ProductSection";
import { mockProducts } from "../data/mockProducts";

function Home() {
    return (
        <>
            <ProductSection
                title="Home"
                products={mockProducts}
                page="products"
                options={{
                    sort: (a, b) => b.price - a.price,
                    limit: 8
                }} />
        </>
    )
}

export default Home;