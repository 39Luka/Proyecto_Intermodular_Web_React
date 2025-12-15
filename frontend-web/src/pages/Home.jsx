import CardVertical from "../components/CardVertical";
import ProductSection from "../components/ProductSection";
import { mockProducts } from "../data/mockProducts";

function Home() {
    return (
        <>
            <ProductSection
                title="Home"
                products={mockProducts}
                options={{
                    sort: (a, b) => b.price - a.price,
                    limit: 8
                }} 
                CardComponent={CardVertical}
                />
        
        </>
    )
}

export default Home;