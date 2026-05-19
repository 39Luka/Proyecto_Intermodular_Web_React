import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

/**
 * Hook de acceso al contexto de autenticación.
 *
 * Proporciona acceso al estado de autenticación del usuario y a las acciones
 * de sesión. Debe usarse dentro de un componente envuelto por `AuthProvider`.
 *
 * @returns {{
 *   user: { id: number, email: string, name: string, role: string }|null,
 *   isAuthenticated: boolean,
 *   isAdmin: boolean,
 *   loading: boolean,
 *   login: (email: string, password: string) => Promise<Object>,
 *   register: (email: string, password: string) => Promise<Object>,
 *   logout: () => void
 * }} Contexto de autenticación.
 * @throws {Error} Si se usa fuera de `AuthProvider`.
 *
 * @example
 * const { user, isAuthenticated, logout } = useAuth();
 */
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth debe ser utilizado dentro de un AuthProvider");
    }
    return context;
}
