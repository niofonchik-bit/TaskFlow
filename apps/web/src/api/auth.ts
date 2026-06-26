import { apiRequest } from './http';
import type {
    AuthUser,
    LoginPayload,
    RegisterPayload,
} from '../auth/auth.types';

/** регистрирует аккаунт по почте */
export function registerAccount(payload: RegisterPayload): Promise<AuthUser> {
    return apiRequest<AuthUser>('/JS/auth/register', {
        method: 'POST',
        body: payload,
    });
}

/** выполняет вход по почте и паролю */
export function loginAccount(payload: LoginPayload): Promise<AuthUser> {
    return apiRequest<AuthUser>('/JS/auth/login', {
        method: 'POST',
        body: payload,
    });
}

/** завершает текущую сессию */
export function logoutAccount(): Promise<{ success: boolean }> {
    return apiRequest<{ success: boolean }>('/JS/auth/logout', {
        method: 'POST',
    });
}

/** загружает текущего пользователя */
export function fetchCurrentUser(): Promise<AuthUser> {
    return apiRequest<AuthUser>('/JS/auth/me');
}
