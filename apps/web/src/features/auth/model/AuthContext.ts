import { createContext } from 'react';
import type { AuthUser, LoginPayload, RegisterPayload } from './auth.types';

export interface AuthContextValue {
    user: AuthUser | null;
    isLoading: boolean;
    initializationError: string | null;
    login: (payload: LoginPayload) => Promise<AuthUser>;
    register: (payload: RegisterPayload) => Promise<AuthUser>;
    logout: () => Promise<void>;
    refreshUser: () => Promise<AuthUser | null>;
    verifyEmailStub: () => Promise<AuthUser>;
    retryInitialization: () => Promise<void>;
}

/** хранит состояние авторизации без session token */
export const AuthContext = createContext<AuthContextValue | null>(null);
