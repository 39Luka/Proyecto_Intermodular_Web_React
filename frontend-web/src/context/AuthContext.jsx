/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect } from "react";
import { authService } from "../services/authService";

export const AuthContext = createContext();

/**
 * Decodes a JWT token payload without any external library.
 * Uses atob (base64) to decode the middle part of the JWT.
 * @param {string} token - JWT token string
 * @returns {object|null} Decoded payload or null if invalid
 */
function decodeJWT(token) {
    try {
        const parts = token.split(".");
        if (parts.length !== 3) return null;
        // Base64url → Base64: replace - with + and _ with /
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
}

/**
 * Builds a user object from a JWT token.
 * The Bakery API JWT payload contains: sub (email), role, exp, iat.
 * @param {string} token
 * @param {string} [fallbackEmail]
 * @returns {object} user object with id, email, name, role
 */
function buildUserFromToken(token, fallbackEmail = "") {
    const payload = decodeJWT(token);
    const email = payload?.sub || payload?.email || fallbackEmail;
    const role = payload?.role || payload?.roles?.[0] || "USER";
    // The JWT may include userId; otherwise we'll fetch it separately if needed
    const id = payload?.userId || payload?.id || null;
    return {
        id,
        email,
        name: email.split("@")[0],
        role,
    };
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Restore session from localStorage on mount
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        // API returns only { token }
        const data = await authService.login(email, password);
        const token = data.token || data.accessToken || data.jwt;
        if (!token) throw new Error("No se recibió token del servidor.");

        localStorage.setItem("authToken", token);

        // Decode the JWT to extract user info (sub=email, role)
        const loggedUser = buildUserFromToken(token, email);
        setUser(loggedUser);
        localStorage.setItem("user", JSON.stringify(loggedUser));
        return loggedUser;
    };

    const register = async (...args) => {
        // Backward compatible signature:
        // register(email, password) or register(name, email, password)
        let email = "";
        let password = "";
        if (args.length >= 3) {
            email = args[1];
            password = args[2];
        } else {
            email = args[0];
            password = args[1];
        }

        // API RegisterRequest only accepts { email, password }
        const data = await authService.register(email, password);
        const token = data.token || data.accessToken || data.jwt;
        if (!token) throw new Error("No se recibió token del servidor.");

        localStorage.setItem("authToken", token);

        const newUser = buildUserFromToken(token, email);
        setUser(newUser);
        localStorage.setItem("user", JSON.stringify(newUser));
        return newUser;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("user");
        localStorage.removeItem("authToken");
    };

    const isAdmin = user?.role === "ADMIN";

    const value = {
        user,
        isAuthenticated: !!user,
        isAdmin,
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
