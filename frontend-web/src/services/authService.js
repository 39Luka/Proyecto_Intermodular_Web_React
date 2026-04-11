import { apiFetch } from "./api";

/**
 * Authenticates a user and returns the JWT token + user info.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{ token: string, user: object }>}
 */
export const authService = {
    login: async (email, password) => {
        const data = await apiFetch("/auth/login", {
            method: "POST",
            body: JSON.stringify({ email, password }),
        }, true); // skipAuth = true (public endpoint)
        return data;
    },

    register: async (nombre, email, password) => {
        const data = await apiFetch("/auth/register", {
            method: "POST",
            body: JSON.stringify({ nombre, email, password }),
        }, true); // skipAuth = true (public endpoint)
        return data;
    },
};
