import { getGlobalAuth } from "../contexts/auth-context";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";


function getAccessToken() {
    const { tokens } = getGlobalAuth();
    return tokens?.accessToken || null;
}
export async function apiFetch(input: string, options: RequestInit = {}) {
    const accessToken = await getAccessToken();

    // build headers
    const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...(options.headers as Record<string, string>),
    };

    if (accessToken) {
        headers["Authorization"] = `Bearer ${accessToken}`;
    }

    let response = await fetch(API_BASE_URL + input, {
        ...options,
        headers,
    });

    // If token expired -> try refresh
    if (response.status === 401) {
        const refreshed = await tryRefreshToken();

        if (refreshed) {
            const newToken = await getAccessToken();

            const retryHeaders = {
                ...headers,
                Authorization: `Bearer ${newToken}`,
            };

            response = await fetch(API_BASE_URL + input, {
                ...options,
                headers: retryHeaders,
            });
        }
    }

    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || "Request failed");
    }

    return response;
}

async function tryRefreshToken() {
    const { refreshAuth, logout } = getGlobalAuth();
    if (!refreshAuth || !logout) return false;
    try {
        await refreshAuth();     // Better Auth automatically uses refreshToken
        return true;
    } catch (err) {
        logout();
        window.location.href = "/login";
        return false;
    }
}
