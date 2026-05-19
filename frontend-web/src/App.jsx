import { AuthProvider } from "./context/AuthContext";
import { SearchProvider } from "./context/SearchContext";
import { CartProvider } from "./context/CartContext";
import Header from "./components/layout/Header.jsx";
import Footer from "./components/layout/Footer.jsx";
import AppRoutes from "./routes/AppRoutes.jsx";
import { useAuth } from "./hooks/useAuth";

function AppContent() {
    const { loading } = useAuth();

    if (loading) {
        return (
            <div className="section-loader-wrap section-loader-wrap--splash">
                <div className="section-spinner section-spinner--splash" aria-label="Cargando..."></div>
                <h1 className="section-loader-text section-loader-text--splash">La Croassantina</h1>
                <p className="section-loader-subtext">Iniciando aplicación...</p>
            </div>
        );
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
            <SearchProvider>
                <CartProvider>
                    <AppContent />
                </CartProvider>
            </SearchProvider>
        </AuthProvider>
    );
}

export default App;
