import { useEffect, useState, type ReactNode } from 'react';
import { fetchCurrentUser, loginAccount, logoutAccount, registerAccount, verifyCurrentEmailStub } from '../api/auth.api';
import { ApiError } from '../../../shared/api/http';
import { AuthContext } from './AuthContext';
import type { AuthUser, LoginPayload, RegisterPayload } from './auth.types';

interface AuthProviderProps {
    children: ReactNode;
}

/** получает текущего пользователя или отсутствие сессии */
async function resolveCurrentUser(): Promise<AuthUser | null> {
    try {
        return await fetchCurrentUser();
    } catch (error: unknown) {
        if (error instanceof ApiError && error.status === 401) {
            return null;
        }

        throw error;
    }
}

/** предоставляет состояние авторизации всему приложению */
export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [initializationError, setInitializationError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        /** загружает пользователя при запуске приложения */
        async function initializeAuth() {
            try {
                const currentUser = await resolveCurrentUser();

                if (isMounted) {
                    setUser(currentUser);
                }
            } catch (error: unknown) {
                if (isMounted) {
                    setInitializationError(error instanceof Error ? error.message : 'не удалось проверить сессию');
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        }

        void initializeAuth();

        return () => {
            isMounted = false;
        };
    }, []);

    /** повторяет начальную проверку сессии */
    async function retryInitialization(): Promise<void> {
        setIsLoading(true);
        setInitializationError(null);

        try {
            setUser(await resolveCurrentUser());
        } catch (error: unknown) {
            setInitializationError(error instanceof Error ? error.message : 'не удалось проверить сессию');
        } finally {
            setIsLoading(false);
        }
    }

    /** обновляет пользователя по session-cookie */
    async function refreshUser(): Promise<AuthUser | null> {
        const currentUser = await resolveCurrentUser();

        setUser(currentUser);

        return currentUser;
    }

    /** выполняет вход и сохраняет данные пользователя */
    async function login(payload: LoginPayload): Promise<AuthUser> {
        const loggedUser = await loginAccount(payload);

        setUser(loggedUser);

        return loggedUser;
    }

    /** выполняет регистрацию и сохраняет данные пользователя */
    async function register(payload: RegisterPayload): Promise<AuthUser> {
        const registeredUser = await registerAccount(payload);

        setUser(registeredUser);

        return registeredUser;
    }

    /** подтверждает почту через временную заглушку */
    async function verifyEmailStub(): Promise<AuthUser> {
        const verifiedUser = await verifyCurrentEmailStub();

        setUser(verifiedUser);

        return verifiedUser;
    }

    /** завершает текущую сессию */
    async function logout(): Promise<void> {
        try {
            await logoutAccount();
        } finally {
            setUser(null);
        }
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                initializationError,
                login,
                register,
                logout,
                refreshUser,
                verifyEmailStub,
                retryInitialization,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
