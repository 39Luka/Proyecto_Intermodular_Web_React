const DEFAULT_API_BASE_URL = "https://proyectointermodularapi-production.up.railway.app";
const ENV_API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.trim();
const API_BASE_URL = (ENV_API_BASE_URL || DEFAULT_API_BASE_URL).replace(/\/+$/, "");

function buildUrl(endpoint) {
    if (!endpoint) return API_BASE_URL;
    if (endpoint.startsWith("http://") || endpoint.startsWith("https://")) return endpoint;
    return `${API_BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;
}

async function parseErrorResponse(response) {
    let errorMessage = `Error ${response.status}: ${response.statusText}`;

    try {
        const errorData = await response.json();
        if (errorData?.message) {
            errorMessage = errorData.message;
        }
    } catch {
        try {
            const text = await response.text();
            if (text) errorMessage = text;
        } catch {
            // Ignore parsing fallback errors
        }
    }

    if (response.status === 401 || response.status === 403) {
        return "No autorizado. Inicia sesion y vuelve a intentarlo.";
    }

    return errorMessage;
}

/**
 * Makes HTTP requests to the backend API.
 * @param {string} endpoint
 * @param {RequestInit} [options]
 * @param {boolean} [skipAuth]
 * @returns {Promise<any>}
 */
export async function apiFetch(endpoint, options = {}, skipAuth = false) {
    const headers = {
        "Content-Type": "application/json",
        ...options.headers,
    };

    if (!skipAuth) {
        const token = localStorage.getItem("authToken");
        if (token) headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(buildUrl(endpoint), {
        ...options,
        headers,
    });

    if (!response.ok) {
        const message = await parseErrorResponse(response);
        throw new Error(message);
    }

    if (response.status === 204) return null;

    try {
        return await response.json();
    } catch {
        return await response.text();
    }
}
