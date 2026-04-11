import { createContext, useState, useEffect } from "react";
import { authService } from "../services/authService";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Check localStorage on mount
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const data = await authService.login(email, password);
        // API returns { token, ... } — store JWT and user info
        const token = data.token || data.accessToken || data.jwt;
        if (!token) throw new Error("No se recibió token del servidor.");

        localStorage.setItem("authToken", token);

        // Build user object from response (adapt fields as needed)
        const loggedUser = {
            id: data.id ?? data.userId ?? null,
            name: data.nombre || data.name || email.split("@")[0],
            email: data.email || email,
            role: data.role || data.roles?.[0] || "USER",
        };
        setUser(loggedUser);
        localStorage.setItem("user", JSON.stringify(loggedUser));
        return loggedUser;
    };

    const register = async (nombre, email, password) => {
        const data = await authService.register(nombre, email, password);
        // After register, auto-login if we get a token
        const token = data.token || data.accessToken || data.jwt;
        if (token) {
            localStorage.setItem("authToken", token);
        }

        const newUser = {
            id: data.id ?? null,
            name: data.nombre || data.name || nombre,
            email: data.email || email,
            role: data.role || "USER",
        };
        setUser(newUser);
        localStorage.setItem("user", JSON.stringify(newUser));
        return newUser;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("user");
        localStorage.removeItem("authToken");
    };

    const value = {
        user,
        isAuthenticated: !!user,
        loading,
        login,
        register,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}
