const API_BASE_URL = "/api";

/**
 * Helper function to handle API requests.
 * @param {string} endpoint - The endpoint to append to the base URL (e.g., "/productos").
 * @param {object} [options={}] - Fetch options.
 * @param {boolean} [skipAuth=false] - Skip attaching auth token.
 * @returns {Promise<any>} - The JSON response.
 */
export async function apiFetch(endpoint, options = {}, skipAuth = false) {
    const headers = {
        "Content-Type": "application/json",
        ...options.headers,
    };

    if (!skipAuth) {
        const token = localStorage.getItem("authToken");
        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        let errorMessage = `Error ${response.status}: ${response.statusText}`;

        try {
            const errorData = await response.json();
            if (errorData?.message) errorMessage = errorData.message;
        } catch {
            // fallback a texto plano si no hay JSON
            try {
                const text = await response.text();
                if (text) errorMessage = text;
            } catch {
                // no hay nada
            }
        }

        // Manejo específico de auth
        if (response.status === 401 || response.status === 403) {
            errorMessage = "No autorizado. Por favor inicia sesión.";
        }

        throw new Error(errorMessage);
    }

    // 204 No Content
    if (response.status === 204) return null;

    // Intentar devolver JSON, fallback a texto
    try {
        return await response.json();
    } catch {
        return await response.text();
    }
}
