import { createContext, useState, useEffect } from "react";

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

    const login = (email, password) => {
        // Simulated login
        const mockUser = {
            id: 1,
            name: "Usuario",
            email: email
        };
        setUser(mockUser);
        localStorage.setItem("user", JSON.stringify(mockUser));
        return Promise.resolve(mockUser);
    };

    const register = (name, email, password) => {
        // Simulated registration
        const mockUser = {
            id: Date.now(),
            name: name,
            email: email
        };
        setUser(mockUser);
        localStorage.setItem("user", JSON.stringify(mockUser));
        return Promise.resolve(mockUser);
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("user");
    };

    const value = {
        user,
        isAuthenticated: !!user,
        loading,
        login,
        register,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}
