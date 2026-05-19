/**
 * @fileoverview Servicio REST para gestión de usuarios.
 *
 * Incluye operaciones de administración (CRUD de usuarios) y operaciones
 * de perfil del usuario autenticado (obtener perfil, cambiar contraseña,
 * subir avatar).
 *
 * Endpoints de admin: requieren rol ADMIN.
 * Endpoints de perfil (`/auth/me/*`): requieren autenticación.
 *
 * @module userService
 */
import { apiFetch } from "./api";

/** @private Extrae el array de items de una respuesta paginada de Spring o de un array directo. */
const extractData = (data) => Array.isArray(data) ? data : (Array.isArray(data?.content) ? data.content : []);

export const userService = {
    /**
     * Obtiene todos los usuarios de forma paginada. Solo Administradores.
     *
     * @param {number} page - Número de página.
     * @param {number} size - Tamaño de la página.
     * @returns {Promise<{ users: Array, totalPages: number, totalElements: number }>}
     */
    getAllUsers: async (page = 0, size = 10) => {
        const params = new URLSearchParams({ page, size });
        const data = await apiFetch(`/users?${params.toString()}`);
        const users = extractData(data);
        return {
            users,
            totalPages: data?.totalPages ?? 1,
            totalElements: data?.totalElements ?? users.length,
        };
    },
    // ----- Funciones existentes exclusivas de admin -----
    /**
     * Obtiene un usuario por su correo electrónico. Solo Administradores.
     *
     * @param {string} email - Correo electrónico del usuario.
     * @returns {Promise<Object>}
     */
    getUserByEmail: async (email) => {
        const params = new URLSearchParams({ email });
        return apiFetch(`/users?${params.toString()}`);
    },
    /**
     * Obtiene un usuario por su ID único. Solo Administradores.
     *
     * @param {number} id - ID del usuario.
     * @returns {Promise<Object>}
     */
    getUserById: async (id) => {
        return apiFetch(`/users/${id}`);
    },
    /**
     * Crea un nuevo usuario. Solo Administradores.
     *
     * @param {Object} payload - Datos del usuario a crear.
     * @returns {Promise<Object>}
     */
    createUser: async (payload) => {
        return apiFetch("/users", { method: "POST", body: JSON.stringify(payload) });
    },
    /**
     * Activa o desactiva un usuario (bloqueo lógico). Solo Administradores.
     *
     * @param {number} id - ID del usuario.
     * @param {boolean} active - Estado activo/inactivo.
     * @returns {Promise<void>}
     */
    patchUser: async (id, active) => {
        await apiFetch(`/users/${id}`, { method: "PATCH", body: JSON.stringify({ active }) });
    },

    // ----- Nuevos endpoints introducidos por el cambio de la API -----
    /**
     * Obtiene el perfil del usuario autenticado actual (incluye avatar).
     *
     * @returns {Promise<Object>}
     */
    getCurrentUser: async () => {
        return apiFetch("/auth/me");
    },
    /**
     * Cambia la contraseña del usuario autenticado actual.
     *
     * @param {{ currentPassword: string, newPassword: string }} payload - Contraseñas antigua y nueva.
     * @returns {Promise<void>}
     */
    updatePassword: async (payload) => {
        return apiFetch("/auth/me/password", { method: "PATCH", body: JSON.stringify(payload) });
    },
    /**
     * Sube o reemplaza la imagen del avatar del usuario actual (en formato base64).
     *
     * @param {string} payload - Cadena base64 de la imagen.
     * @returns {Promise<void>}
     */
    uploadAvatar: async (payload) => {
        return apiFetch("/auth/me/profile-image", { method: "PATCH", body: JSON.stringify(payload) });
    },
};
