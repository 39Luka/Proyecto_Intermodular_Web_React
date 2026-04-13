import { Route, Routes, Navigate } from "react-router-dom";
import MainContent from "../components/layout/MainContent";
import Home from "../pages/Home";
import ProductDetail from "../pages/ProductDetail";
import PurchaseDetail from "../pages/PurchaseDetail";
import Products from "../pages/Products"
import Cart from "../pages/Cart";
import Promotions from "../pages/Promotions";
import Purchased from "../pages/Purchased";
import Login from "../pages/Login";
import Register from "../pages/Register";

// Auth & Protection
import AdminRoute from "../components/auth/AdminRoute";
import ProtectedRoute from "../components/auth/ProtectedRoute";

import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminProducts from "../pages/admin/AdminProducts";
import AdminProductForm from "../pages/admin/AdminProductForm";
import AdminCategories from "../pages/admin/AdminCategories";
import AdminPromotions from "../pages/admin/AdminPromotions";
import AdminUsers from "../pages/admin/AdminUsers";

function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<MainContent />}>
                {/* Public Routes */}
                <Route index element={<Home />} />
                <Route path="home" element={<Home />} />
                <Route path="products" element={<Products />} />
                <Route path="products/:id" element={<ProductDetail />} />
                <Route path="promo" element={<Promotions />} />
                
                {/* Guest-only Routes */}
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
                
                {/* Protected User Routes */}
                <Route path="cart" element={
                    <ProtectedRoute>
                        <Cart />
                    </ProtectedRoute>
                } />
                <Route path="purchased" element={
                    <ProtectedRoute>
                        <Purchased />
                    </ProtectedRoute>
                } />
                <Route path="purchased/:id" element={
                    <ProtectedRoute>
                        <PurchaseDetail />
                    </ProtectedRoute>
                } />
                
                {/* Protected Admin Routes */}
                <Route path="admin" element={<AdminRoute />}>
                    <Route index element={<AdminDashboard />} />
                    <Route path="products" element={<AdminProducts />} />
                    <Route path="products/new" element={<AdminProductForm />} />
                    <Route path="products/edit/:id" element={<AdminProductForm />} />
                    <Route path="categories" element={<AdminCategories />} />
                    <Route path="promotions" element={<AdminPromotions />} />
                    <Route path="users" element={<AdminUsers />} />
                </Route>

                <Route path="*" element={<Navigate to="/home" replace />} />
            </Route>
        </Routes>
    )
}

export default AppRoutes;