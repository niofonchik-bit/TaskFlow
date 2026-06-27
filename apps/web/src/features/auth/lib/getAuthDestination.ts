import type { AuthUser } from '../model/auth.types';

/** возвращает стартовый маршрут для состояния аккаунта */
export function getAuthDestination(user: AuthUser | null): string {
    if (!user) {
        return '/login';
    }

    if (!user.emailVerifiedAt) {
        return '/verify-email';
    }

    if (user.organizations.length === 0) {
        return '/onboarding';
    }

    return '/me';
}
