import { AuthProvider } from './context/AuthContext';
import { useAuth } from './hooks/useAuth';
import { Navigate, Route, Routes } from 'react-router-dom';
import Footer from './components/layout/Footer.jsx';
import Header from './components/layout/Header.jsx';
import AppRoutes from './routes/AppRoutes.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';

function AppContent() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>Cargando...</div>;
  }

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
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
      <AppContent />
    </AuthProvider>
  );
}

export default App;
