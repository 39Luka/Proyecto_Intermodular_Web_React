import { apiFetch } from "./api";

/**
 * Autentica al usuario y devuelve el token JWT { token }.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{ token: string }>}
 */
export const authService = {
    login: async (email, password) => {
        const data = await apiFetch("/auth/login", {
            method: "POST",
            body: JSON.stringify({ email, password }),
        }, true); // skipAuth = true (endpoint público)
        return data;
    },

    /**
     * Crea una nueva cuenta de usuario y devuelve el token de acceso.
     * La solicitud de registro de la API solo acepta { email, password } — el nombre NO es un campo válido.
     * @param {string} email
     * @param {string} password
     * @returns {Promise<{ token: string }>}
     */
    register: async (email, password) => {
        const data = await apiFetch("/auth/register", {
            method: "POST",
            body: JSON.stringify({ email, password }),
        }, true); // skipAuth = true (endpoint público)
        return data;
    },

    /**
     * Refresca el token de acceso usando el token de refresco.
     * @param {string} refreshToken
     * @returns {Promise<{ token: string, refreshToken: string, expiresIn: number }>}
     */
    refreshToken: async (refreshToken) => {
        const data = await apiFetch("/auth/refresh", {
            method: "POST",
            body: JSON.stringify({ refreshToken }),
        }, true); // skipAuth = true (no enviar cabecera Authorization)
        return data;
    },
};
