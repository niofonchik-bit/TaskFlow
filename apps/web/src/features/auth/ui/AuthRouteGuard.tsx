import { Navigate, Outlet } from 'react-router-dom';
import { getAuthDestination } from '../lib/getAuthDestination';
import { useAuth } from '../model/useAuth';
import { FullScreenError, FullScreenLoader } from '../../../shared/ui/FullScreenState';

type AuthAccess = 'guest' | 'verify_email' | 'onboarding' | 'workspace';

interface AuthRouteGuardProps {
    access: AuthAccess;
}

/** проверяет соответствие пользователя типу маршрута */
function hasRouteAccess(access: AuthAccess, emailVerifiedAt: string | null | undefined, organizationCount: number, hasUser: boolean): boolean {
    switch (access) {
        case 'guest':
            return !hasUser;

        case 'verify_email':
            return hasUser && !emailVerifiedAt;

        case 'onboarding':
            return hasUser && Boolean(emailVerifiedAt) && organizationCount === 0;

        case 'workspace':
            return hasUser && Boolean(emailVerifiedAt) && organizationCount > 0;
    }
}

/** ограничивает маршрут состоянием аккаунта */
export function AuthRouteGuard({ access }: AuthRouteGuardProps) {
    const { user, isLoading, initializationError, retryInitialization } = useAuth();

    if (isLoading) {
        return <FullScreenLoader />;
    }

    if (initializationError) {
        return (
            <FullScreenError
                message={initializationError}
                onRetry={() => void retryInitialization()}
            />
        );
    }

    const hasAccess = hasRouteAccess(access, user?.emailVerifiedAt, user?.organizations.length ?? 0, Boolean(user));

    if (!hasAccess) {
        return (
            <Navigate
                to={getAuthDestination(user)}
                replace
            />
        );
    }

    return <Outlet />;
}
