/**
 * @fileoverview Definición central de rutas de la aplicación.
 *
 * Estructura de rutas:
 * - **Públicas**: `/home`, `/products`, `/products/:id`, `/promo`, `/login`, `/register`.
 * - **Protegidas (usuario)**: `/cart`, `/purchased`, `/purchased/:id`, `/profile`, `/change-password`.
 * - **Protegidas (admin)**: `/admin/*` — requiere rol ADMIN, gestionado por `AdminRoute`.
 * - **Catch-all**: cualquier ruta desconocida redirige a `/home`.
 *
 * @module AppRoutes
 */
import { Route, Routes, Navigate } from "react-router-dom";
import MainContent from "../components/layout/MainContent";
import Home from "../pages/Home";
import ProductDetail from "../pages/ProductDetail";
import PurchaseDetail from "../pages/PurchaseDetail";
import Products from "../pages/Products";
import Cart from "../pages/Cart";
import Promotions from "../pages/Promotions";
import Purchased from "../pages/Purchased";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Profile from "../pages/Profile";
import ChangePassword from "../pages/ChangePassword";

// Autenticación y Protección
import AdminRoute from "../components/auth/AdminRoute";
import ProtectedRoute from "../components/auth/ProtectedRoute";

import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminProducts from "../pages/admin/AdminProducts";
import AdminProductForm from "../pages/admin/AdminProductForm";
import AdminCategories from "../pages/admin/AdminCategories";
import AdminPromotions from "../pages/admin/AdminPromotions";
import AdminUsers from "../pages/admin/AdminUsers";
import AdminPurchases from "../pages/admin/AdminPurchases";

/**
 * Componente raíz de enrutamiento de la aplicación.
 *
 * Define el árbol completo de rutas usando React Router v7.
 * Las rutas protegidas se envuelven con `ProtectedRoute` (usuario autenticado)
 * o `AdminRoute` (rol ADMIN requerido).
 *
 * @component
 * @returns {JSX.Element} Árbol de `<Routes>` con todos los puntos de entrada de la app.
 */
function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<MainContent />}>
                {/* Rutas Públicas */}
                <Route index element={<Home />} />
                <Route path="home" element={<Home />} />
                <Route path="products" element={<Products />} />
                <Route path="products/:id" element={<ProductDetail />} />
                <Route path="promo" element={<Promotions />} />
                
                {/* Rutas exclusivas para invitados */}
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
                
                {/* Rutas Protegidas de Usuario */}
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
                
                {/* Rutas Protegidas de Administración */}
                <Route path="admin" element={<AdminRoute />}>
                    <Route index element={<AdminDashboard />} />
                    <Route path="products" element={<AdminProducts />} />
                    <Route path="products/new" element={<AdminProductForm />} />
                    <Route path="products/edit/:id" element={<AdminProductForm />} />
                    <Route path="categories" element={<AdminCategories />} />
                    <Route path="promotions" element={<AdminPromotions />} />
                    <Route path="users" element={<AdminUsers />} />
                    <Route path="purchases" element={<AdminPurchases />} />
                </Route>

                {/* Ruta Protegida de Perfil */}
                <Route path="profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="change-password" element={<ProtectedRoute><ChangePassword /></ProtectedRoute>} />

                <Route path="*" element={<Navigate to="/home" replace />} />
            </Route>
        </Routes>
    )
}

export default AppRoutes;