import { createContext } from 'react';
import type { AuthUser, LoginPayload, RegisterPayload } from './auth.types';

export interface AuthContextValue {
    user: AuthUser | null;
    isLoading: boolean;
    login: (payload: LoginPayload) => Promise<void>;
    register: (payload: RegisterPayload) => Promise<void>;
    logout: () => Promise<void>;
    refreshUser: () => Promise<AuthUser | null>;
}

/** хранит состояние авторизации без хранения session token */
export const AuthContext = createContext<AuthContextValue | null>(null);
