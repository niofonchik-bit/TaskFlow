import {
    useCallback,
    useEffect,
    useMemo,
    useState,
    type ReactNode,
} from 'react';
import {
    fetchCurrentUser,
    loginAccount,
    logoutAccount,
    registerAccount,
} from '../api/auth';
import { ApiError } from '../api/http';
import { AuthContext } from './AuthContext';
import type { AuthUser, LoginPayload, RegisterPayload } from './auth.types';

interface AuthProviderProps {
    children: ReactNode;
}

/** предоставляет состояние авторизации всему приложению */
export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    /** обновляет пользователя по session-cookie */
    const refreshUser = useCallback(async (): Promise<AuthUser | null> => {
        try {
            const currentUser = await fetchCurrentUser();

            setUser(currentUser);

            return currentUser;
        } catch (error: unknown) {
            if (error instanceof ApiError && error.status === 401) {
                setUser(null);

                return null;
            }

            throw error;
        }
    }, []);

    useEffect(() => {
        /** загружает пользователя при старте приложения */
        async function loadUser() {
            try {
                await refreshUser();
            } finally {
                setIsLoading(false);
            }
        }

        void loadUser();
    }, [refreshUser]);

    /** выполняет вход и сохраняет только данные пользователя */
    const login = useCallback(async (payload: LoginPayload): Promise<void> => {
        const loggedUser = await loginAccount(payload);

        setUser(loggedUser);
    }, []);

    /** выполняет регистрацию и сохраняет только данные пользователя */
    const register = useCallback(
        async (payload: RegisterPayload): Promise<void> => {
            const registeredUser = await registerAccount(payload);

            setUser(registeredUser);
        },
        [],
    );

    /** завершает сессию и очищает состояние */
    const logout = useCallback(async (): Promise<void> => {
        try {
            await logoutAccount();
        } finally {
            setUser(null);
        }
    }, []);

    const value = useMemo(
        () => ({
            user,
            isLoading,
            login,
            register,
            logout,
            refreshUser,
        }),
        [isLoading, login, logout, refreshUser, register, user],
    );

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
}
