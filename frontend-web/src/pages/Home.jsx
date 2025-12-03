import ProductSection from "../components/ProductSection";
import { mockProducts } from "../data/mockProducts";

function Home(){
    return(
        <>
         <ProductSection title="Home" products={mockProducts} page="products"/>

        </>
    )
}

export default Home;