import { apiFetch } from "./api";

/**
 * Service for admin-only user management endpoints.
 * All endpoints require ADMIN role — will return 403 for regular users.
 *
 * API UserResponse fields: id, email, role (USER|ADMIN), enabled (boolean).
 */
export const userService = {
    /**
     * Get a user by email. Admin-only.
     * GET /users?email=...
     * @param {string} email
     * @returns {Promise<{ id, email, role, enabled }>}
     */
    getUserByEmail: async (email) => {
        const params = new URLSearchParams({ email });
        return apiFetch(`/users?${params.toString()}`);
    },

    /**
     * Get a user by ID. Admin-only.
     * GET /users/{id}
     * @param {number} id
     * @returns {Promise<{ id, email, role, enabled }>}
     */
    getUserById: async (id) => {
        return apiFetch(`/users/${id}`);
    },

    /**
     * Create a user with a specific role. Admin-only.
     * POST /users
     * @param {{ email: string, password: string, role: "USER"|"ADMIN" }} payload
     * @returns {Promise<{ id, email, role, enabled }>}
     */
    createUser: async (payload) => {
        return apiFetch("/users", {
            method: "POST",
            body: JSON.stringify(payload),
        });
    },

    /**
     * Enable or disable a user account. Admin-only.
     * PATCH /users/{id}
     * Returns 204 No Content.
     * @param {number} id
     * @param {boolean} active - true = enable, false = disable
     */
    patchUser: async (id, active) => {
        await apiFetch(`/users/${id}`, {
            method: "PATCH",
            body: JSON.stringify({ active }),
        });
    },
};
