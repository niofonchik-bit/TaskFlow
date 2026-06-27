import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { getAuthDestination } from '../../features/auth/lib/getAuthDestination';
import { useAuth } from '../../features/auth/model/useAuth';
import { AuthRouteGuard } from '../../features/auth/ui/AuthRouteGuard';
import { FullScreenError, FullScreenLoader } from '../../shared/ui/FullScreenState';

const AuthPage = lazy(() =>
    import('../../features/auth/pages/AuthPage').then((module) => ({
        default: module.AuthPage,
    })),
);

const VerifyEmailPage = lazy(() =>
    import('../../features/auth/pages/VerifyEmailPage').then((module) => ({
        default: module.VerifyEmailPage,
    })),
);

const OnboardingPlaceholderPage = lazy(() =>
    import('../../features/auth/pages/OnboardingPlaceholderPage').then((module) => ({
        default: module.OnboardingPlaceholderPage,
    })),
);

const UserProfilePage = lazy(() =>
    import('../../shared/pages/UserProfilePage').then((module) => ({
        default: module.UserProfilePage,
    })),
);

/** перенаправляет пользователя в подходящую часть приложения */
function AuthRedirect() {
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

    return (
        <Navigate
            to={getAuthDestination(user)}
            replace
        />
    );
}

/** настраивает маршруты приложения */
export function AppRouter() {
    return (
        <Suspense fallback={<FullScreenLoader label='Загрузка страницы...' />}>
            <Routes>
                <Route
                    path='/'
                    element={<AuthRedirect />}
                />

                <Route element={<AuthRouteGuard access='guest' />}>
                    <Route
                        path='/login'
                        element={<AuthPage />}
                    />

                    <Route
                        path='/register'
                        element={<AuthPage />}
                    />
                </Route>

                <Route element={<AuthRouteGuard access='verify_email' />}>
                    <Route
                        path='/verify-email'
                        element={<VerifyEmailPage />}
                    />
                </Route>

                <Route element={<AuthRouteGuard access='onboarding' />}>
                    <Route
                        path='/onboarding'
                        element={<OnboardingPlaceholderPage />}
                    />
                </Route>

                <Route element={<AuthRouteGuard access='workspace' />}>
                    <Route
                        path='/me'
                        element={<UserProfilePage />}
                    />
                </Route>

                <Route
                    path='*'
                    element={<AuthRedirect />}
                />
            </Routes>
        </Suspense>
    );
}
