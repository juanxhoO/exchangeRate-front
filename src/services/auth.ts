import type { AuthResponse } from '../@types/auth';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export async function signIn(email: string, password: string): Promise<AuthResponse> {
    const res = await fetch(`${API_BASE_URL}/v1/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        //credentials: 'include', // Include cookies if your Go backend uses them
    });

    if (!res.ok) {
        const error = await res.json().catch(() => ({ message: 'Invalid credentials' }));
        throw new Error(error.message || 'Invalid credentials');
    }

    return res.json();
}

export async function signOut(): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/v1/auth/logout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
    });

    if (!res.ok) {
        throw new Error('Failed to sign out');
    }
}

export async function refreshToken(refreshToken: string): Promise<AuthResponse> {
    const res = await fetch(`${API_BASE_URL}/v1/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
        credentials: 'include',
    });

    if (!res.ok) {
        throw new Error('Failed to refresh token');
    }

    return res.json();
}

export async function getCurrentUser(accessToken: string): Promise<AuthResponse['user']> {
    const res = await fetch(`${API_BASE_URL}/v1/auth/me`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`
        },
        credentials: 'include',
    });

    if (!res.ok) {
        throw new Error('Failed to get current user');
    }

    return res.json();
}
