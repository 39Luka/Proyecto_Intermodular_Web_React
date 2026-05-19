/**
 * @fileoverview Contexto global de autenticación.
 *
 * Expone `AuthContext` y `AuthProvider`. El provider gestiona el ciclo de vida
 * completo de la sesión: login, registro, logout y persistencia en `localStorage`.
 *
 * Flujo de login / registro:
 * 1. Llama al servicio REST correspondiente.
 * 2. Extrae el JWT y lo persiste en `localStorage`.
 * 3. Decodifica el payload para construir el objeto `user` (id, email, role).
 * 4. Si el payload no contiene `userId`, consulta el perfil por email para obtenerlo.
 *
 * @module AuthContext
 */
/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useCallback, useMemo } from "react";
import { authService } from "../services/authService";
import { userService } from "../services/userService";

export const AuthContext = createContext();

const decodeJWT = (token) => {
    try {
        const parts = token.split(".");
        if (parts.length !== 3) return null;
        const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split("")
                .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
                .join("")
        );
        return JSON.parse(jsonPayload);
    } catch {
        return null;
    }
};

const buildUserFromToken = (token, fallbackEmail = "") => {
    const payload = decodeJWT(token);
    const email = payload?.sub || payload?.email || fallbackEmail;
    const role = payload?.role || payload?.roles?.[0] || "USER";
    const id = payload?.userId || payload?.id || null;
    return { id, email, name: email.split("@")[0], role };
};

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const stored = localStorage.getItem("user");
        return stored ? JSON.parse(stored) : null;
    });
    const loading = false; // Estado de carga simplificado ya que no se utiliza para la verificación asíncrona de autenticación aquí

    const login = useCallback(async (email, password) => {
        const data = await authService.login(email, password);
        const token = data.token || data.accessToken || data.jwt;
        if (!token) throw new Error("No se recibió token del servidor.");

        localStorage.setItem("authToken", token);
        if (data.refreshToken) localStorage.setItem("refreshToken", data.refreshToken);

        let loggedUser = buildUserFromToken(token, email);

        if (!loggedUser.id) {
            try {
                const profile = await userService.getUserByEmail(loggedUser.email);
                if (profile?.id) loggedUser = { ...loggedUser, id: profile.id };
            } catch { /* Error silenciado */ }
        }

        setUser(loggedUser);
        localStorage.setItem("user", JSON.stringify(loggedUser));
        return loggedUser;
    }, []);

    const register = useCallback(async (email, password) => {
        const data = await authService.register(email, password);
        const token = data.token || data.accessToken || data.jwt;
        if (!token) throw new Error("No se recibió token del servidor.");

        localStorage.setItem("authToken", token);
        if (data.refreshToken) localStorage.setItem("refreshToken", data.refreshToken);

        let newUser = buildUserFromToken(token, email);

        if (!newUser.id) {
            try {
                const profile = await userService.getUserByEmail(newUser.email);
                if (profile?.id) newUser = { ...newUser, id: profile.id };
            } catch { /* Error silenciado */ }
        }

        setUser(newUser);
        localStorage.setItem("user", JSON.stringify(newUser));
        return newUser;
    }, []);

    const logout = useCallback(() => {
        setUser(null);
        localStorage.removeItem("user");
        localStorage.removeItem("authToken");
        localStorage.removeItem("refreshToken");
    }, []);

    const value = useMemo(() => ({
        user,
        isAuthenticated: !!user,
        isAdmin: user?.role === "ADMIN",
        loading,
        login,
        register,
        logout,
    }), [user, loading, login, register, logout]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

