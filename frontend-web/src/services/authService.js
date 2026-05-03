import { apiFetch } from "./api";

/**
 * Authenticates a user and returns the JWT token { token }.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{ token: string }>}
 */
export const authService = {
    login: async (email, password) => {
        const data = await apiFetch("/auth/login", {
            method: "POST",
            body: JSON.stringify({ email, password }),
        }, true); // skipAuth = true (public endpoint)
        return data;
    },

    /**
     * Creates a new USER account and returns an access token.
     * API RegisterRequest only accepts { email, password } — nombre is NOT a valid field.
     * @param {string} email
     * @param {string} password
     * @returns {Promise<{ token: string }>}
     */
    register: async (email, password) => {
        const data = await apiFetch("/auth/register", {
            method: "POST",
            body: JSON.stringify({ email, password }),
        }, true); // skipAuth = true (public endpoint)
        return data;
    },

    /**
     * Refreshes the access token using the refresh token.
     * @param {string} refreshToken
     * @returns {Promise<{ token: string, refreshToken: string, expiresIn: number }>}
     */
    refreshToken: async (refreshToken) => {
        const data = await apiFetch("/auth/refresh", {
            method: "POST",
            body: JSON.stringify({ refreshToken }),
        }, true); // skipAuth = true (don't send Authorization header)
        return data;
    },
};
