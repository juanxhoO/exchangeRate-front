const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export async function fetchUsers(): Promise<any> {
    const res = await fetch(`${API_BASE_URL}/v1/users`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
        const error = await res.json().catch(() => ({ message: 'Invalid credentials' }));
        throw new Error(error.message || 'Invalid credentials');
    }

    return res.json();
}


export async function deleteUser(accessToken: string): Promise<any> {
    const res = await fetch(`${API_BASE_URL}/v1/auth/me`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`
        },
    });

    if (!res.ok) {
        throw new Error('Failed to delete user');
    }
    return res.json();
}


export async function createUser(accessToken: string, data: any): Promise<any> {
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

export async function updateUser(id: string, accessToken: string, data: any): Promise<any> {
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

export async function getUser(id: string, accessToken: string): Promise<any> {
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
