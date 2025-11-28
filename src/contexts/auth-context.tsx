import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User, AuthTokens, AuthState } from '../@types/auth';
import * as authService from '../services/auth';


let globalAuth: {
    tokens: AuthTokens | null;
    refreshAuth: (() => Promise<void>) | null;
    logout: (() => Promise<void>) | null;
} = {
    tokens: null,
    refreshAuth: null,
    logout: null,
};

// access from anywhere
export function getGlobalAuth() {
    return globalAuth;
}


interface AuthContextType extends AuthState {
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEYS = {
    USER: 'auth_user',
    TOKENS: 'auth_tokens',
} as const;

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [tokens, setTokens] = useState<AuthTokens | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Load auth state from localStorage on mount
    useEffect(() => {
        const loadAuthState = () => {
            try {
                const storedTokens = localStorage.getItem(STORAGE_KEYS.TOKENS);
                if (storedTokens) {
                    const parsedTokens = JSON.parse(storedTokens);
                    // Check if token is expired
                    if (parsedTokens.expiresAt > Date.now()) {
                        setTokens(parsedTokens);
                    } else {
                        // Token expired, clear storage
                        localStorage.removeItem(STORAGE_KEYS.TOKENS);
                    }
                }
            } catch (error) {
                console.error('Failed to load auth state:', error);
                localStorage.removeItem(STORAGE_KEYS.USER);
                localStorage.removeItem(STORAGE_KEYS.TOKENS);
            } finally {
                setIsLoading(false);
            }
        };

        loadAuthState();
    }, []);

    useEffect(() => {
        globalAuth.tokens = tokens;
        globalAuth.refreshAuth = refreshAuth;
        globalAuth.logout = logout;
    }, [tokens]);

    // Persist auth state to localStorage whenever it changes
    useEffect(() => {
        if (tokens) {
            console.log(tokens);
            localStorage.setItem(STORAGE_KEYS.TOKENS, JSON.stringify(tokens));
        } else {
            localStorage.removeItem(STORAGE_KEYS.TOKENS);
        }
    }, [tokens]);

    const login = async (email: string, password: string) => {
        setIsLoading(true);
        try {
            const response = await authService.signIn(email, password);
            const newTokens: AuthTokens = {
                accessToken: response.security.jwtAccessToken,
                refreshToken: response.security.jwtRefreshToken,
                expiresAt: Date.now() + 1000 * 60 * 15, // 15 minutes
            };

            console.log(newTokens);
            setUser(response.user);
            setTokens(newTokens);
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        setIsLoading(true);
        try {
            // Call backend logout endpoint
            if (tokens?.accessToken) {
                await authService.signOut();
            }
        } catch (error) {
            console.error('Logout failed:', error);
            // Continue with local logout even if backend call fails
        } finally {
            setUser(null);
            setTokens(null);
            setIsLoading(false);
        }
    };

    const refreshAuth = async () => {
        if (!tokens?.refreshToken) {
            throw new Error('No refresh token available');
        }

        setIsLoading(true);
        try {
            const response = await authService.refreshToken(tokens.refreshToken);

            const newTokens: AuthTokens = {
                accessToken: response.security.jwtAccessToken,
                refreshToken: response.security.jwtRefreshToken,
                expiresAt: Date.now() + 1000 * 60 * 15, // 15 minutes
            };

            setUser(response.user);
            setTokens(newTokens);
        } catch (error) {
            console.error('Token refresh failed:', error);
            // If refresh fails, logout the user
            setUser(null);
            setTokens(null);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const value: AuthContextType = {
        user,
        tokens,
        isAuthenticated: !!tokens,
        isLoading,
        login,
        logout,
        refreshAuth,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
