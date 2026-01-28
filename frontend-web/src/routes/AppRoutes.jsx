import { Route, Routes } from "react-router-dom";
import MainContent from "../components/layout/MainContent";
import Home from "../pages/Home";
import ProductDetail from "../pages/ProductDetail";
import PurchaseDetail from "../pages/PurchaseDetail";
import Products from "../pages/Products"
import Cart from "../pages/Cart";
import Promotions from "../pages/Promotions";
import Purchased from "../pages/Purchased";
function AppRoutes() {
    return (
        <>
            <Routes>
                <Route path="/" element={<MainContent />}>
                    <Route index element={<Home />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/products/:id" element={<ProductDetail />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/promo" element={<Promotions />} />
                    <Route path="/purchased" element={<Purchased />} />
                    <Route path="/purchased/:id" element={<PurchaseDetail />} />
                </Route>
            </Routes>
        </>
    )
}

export default AppRoutes;