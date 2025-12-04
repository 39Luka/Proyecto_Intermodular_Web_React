import { Route, Routes } from "react-router-dom";
import MainContent from "../components/MainContent";
import Home from "../pages/Home";
import ProductDetail from "../pages/ProductDetail";
import Products from "../pages/Products"
function AppRoutes() {
    return (
        <>
            <Routes>
                <Route path="/" element={<MainContent/>}>
                    <Route index element={<Home/>}/>
                    <Route path="/home" element={<Home/>}/>
                    <Route path="/products" element={<Products/>}/>
                    <Route path="/products/:id" element={<ProductDetail/>}/>

                </Route>
            </Routes>
        </>
    )
}

export default AppRoutes;