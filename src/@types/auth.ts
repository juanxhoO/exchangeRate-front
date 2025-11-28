// Authentication types
export interface User {
    id: string;
    email: string;
    name?: string;
    // Add other user fields from your Go backend
}

export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
    expiresAt: number;
}

export interface AuthResponse {
    user: User;
    security: {
        jwtAccessToken: string;
        jwtRefreshToken: string;
    }
}

export interface AuthState {
    user: User | null;
    tokens: AuthTokens | null;
    isAuthenticated: boolean;
    isLoading: boolean;
}
