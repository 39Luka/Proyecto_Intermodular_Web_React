const BASE_URL = (import.meta.env.VITE_API_BASE_URL || "https://proyectointermodularapi-production.up.railway.app").replace(/\/+$/, "");

const getUrl = (path) => path.startsWith("http") ? path : `${BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;

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

                if (!refreshRes.ok) throw new Error("Session expired");

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

