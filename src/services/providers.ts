import { apiFetch } from "../lib/privateFetch";
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export async function fetchProviders(): Promise<any> {
    const res = await apiFetch(`/v1/user/`, {
        method: "GET",
    });

    if (!res.ok) {
        throw new Error('Failed to get providers');
    }

    return res.json();
}


export async function deleteProvider(): Promise<any> {
    const res = await apiFetch(`${API_BASE_URL}/v1/auth/me`, {
        method: "DELETE",
    });

    if (!res.ok) {
        throw new Error('Failed to delete user');
    }
    return res.json();
}


export async function createProvider(accessToken: string, data: any): Promise<any> {
    const res = await fetch(`${API_BASE_URL}/v1/users`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`
        },
    });

    if (!res.ok) {
        throw new Error('Failed to get current user');
    }

    return res.json();
}

export async function updateProvider(id: string, accessToken: string, data: any): Promise<any> {
    const res = await fetch(`${API_BASE_URL}/v1/users/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`
        },
    });

    if (!res.ok) {
        throw new Error('Failed to get current user');
    }

    return res.json();
}

export async function getProvider(id: string, accessToken: string): Promise<any> {
    const res = await fetch(`${API_BASE_URL}/v1/users/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`
        },
    });

    if (!res.ok) {
        throw new Error('Failed to get current user');
    }

    return res.json();
}


export async function searchProviders(parameters: any): Promise<any> {
    console.log(parameters)

    const res = await apiFetch(`/v1/users/search`, {
        method: "GET",
    });

    if (!res.ok) {
        throw new Error('Failed to get current user');
    }

    return res.json();
}