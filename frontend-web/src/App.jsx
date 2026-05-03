import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import Header from "./components/layout/Header.jsx";
import Footer from "./components/layout/Footer.jsx";
import AppRoutes from "./routes/AppRoutes.jsx";
import { useAuth } from "./hooks/useAuth";

function AppContent() {
    const { loading } = useAuth();

    if (loading) {
        return <div className="full-page-loader">Cargando...</div>;
    }

    return (
        <>
            <Header />
            <AppRoutes />
            <Footer />
        </>
    );
}

function App() {
    return (
        <AuthProvider>
            <CartProvider>
                <AppContent />
            </CartProvider>
        </AuthProvider>
    );
}

export default App;
