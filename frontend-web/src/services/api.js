/**
 * @fileoverview Cliente HTTP centralizado de la aplicación.
 *
 * Proporciona la función `apiFetch` que actúa como wrapper de `fetch` añadiendo:
 * - Inyección automática del token JWT en la cabecera `Authorization`.
 * - Refresco transparente del token cuando la API devuelve 401.
 * - Cola de peticiones que esperan el nuevo token durante el refresco.
 * - Redirección a `/login` si el refresco falla.
 * - Gestión unificada de errores con mensajes legibles.
 *
 * @module api
 */

const BASE_URL = (import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV ? "/api" : "https://proyectointermodularapi-production.up.railway.app")).replace(/\/+$/, "");

const getUrl = (path) => path.startsWith("http") ? path : `${BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;

/**
 * Parsea el cuerpo de una respuesta HTTP de error y extrae un mensaje legible.
 *
 * @param {Response} res - Respuesta HTTP de `fetch`.
 * @returns {Promise<string>} Mensaje de error descriptivo.
 * @private
 */
async function parseError(res) {
    if (res.status === 401 || res.status === 403) return "No autorizado. Inicia sesión.";
    try {
        const data = await res.json();
        return data.message || `Error ${res.status}`;
    } catch {
        return res.statusText || `Error ${res.status}`;
    }
}

let isRefreshing = false;
let failedQueue = [];

const processQueue = (err, token = null) => {
    failedQueue.forEach(p => err ? p.reject(err) : p.resolve(token));
    failedQueue = [];
};

/**
 * Realiza una petición HTTP autenticada a la API REST.
 *
 * Flujo de autenticación:
 * 1. Añade `Content-Type: application/json` y el token JWT (si existe) a las cabeceras.
 * 2. Si la respuesta es 401 y hay `refreshToken`, intenta renovar el token silenciosamente.
 * 3. Si múltiples peticiones concurrentes reciben 401 simultáneamente, se encolan y
 *    esperan a que el primer refresh complete antes de reintentarse.
 * 4. Si el refresco falla, limpia el almacenamiento local y redirige a `/login`.
 *
 * @async
 * @param {string} endpoint   - Ruta relativa (ej. `"/products"`) o URL absoluta.
 * @param {RequestInit} [options={}] - Opciones adicionales de `fetch` (method, body, headers…).
 * @param {boolean} [skipAuth=false] - Si `true`, no envía la cabecera `Authorization` (endpoints públicos).
 * @returns {Promise<any>} Datos de la respuesta deserializados como JSON, texto plano, o `null` (204 No Content).
 * @throws {Error} Si la respuesta no es exitosa, lanza un error con el mensaje del servidor.
 *
 * @example
 * // Petición GET pública
 * const products = await apiFetch('/products?page=0&size=12', {}, true);
 *
 * @example
 * // Petición POST autenticada
 * const result = await apiFetch('/purchases', {
 *   method: 'POST',
 *   body: JSON.stringify(payload)
 * });
 */
export async function apiFetch(endpoint, options = {}, skipAuth = false) {
    const headers = { "Content-Type": "application/json", ...options.headers };

    if (!skipAuth) {
        const token = localStorage.getItem("authToken");
        if (token) headers.Authorization = `Bearer ${token}`;
    }

    let res = await fetch(getUrl(endpoint), { ...options, headers });

    if (res.status === 401 && !skipAuth) {
        const refresh = localStorage.getItem("refreshToken");
        if (refresh) {
            if (isRefreshing) {
                const token = await new Promise((resolve, reject) => failedQueue.push({ resolve, reject }));
                headers.Authorization = `Bearer ${token}`;
                return apiFetch(endpoint, options, skipAuth);
            }

            isRefreshing = true;
            try {
                const refreshRes = await fetch(getUrl("/auth/refresh"), {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ refreshToken: refresh })
                });

                if (!refreshRes.ok) throw new Error("Sesión expirada");

                const { token, refreshToken } = await refreshRes.json();
                localStorage.setItem("authToken", token);
                if (refreshToken) localStorage.setItem("refreshToken", refreshToken);

                processQueue(null, token);
                headers.Authorization = `Bearer ${token}`;
                return apiFetch(endpoint, options, skipAuth);
            } catch (err) {
                processQueue(err);
                ["authToken", "refreshToken", "user"].forEach(k => localStorage.removeItem(k));
                window.location.href = "/login";
                throw err;
            } finally {
                isRefreshing = false;
            }
        }
    }

    if (!res.ok) throw new Error(await parseError(res));
    return res.status === 204 ? null : res.json().catch(() => res.text());
}

