import { lazy, Suspense, useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { getAuthDestination } from '../../features/auth/lib/getAuthDestination';
import { useAuth } from '../../features/auth/model/useAuth';
import { AuthRouteGuard } from '../../features/auth/ui/AuthRouteGuard';
import { PageTransition } from '../../shared/animation/ui/PageTransition';
import type { PageTransitionDirection } from '../../shared/animation/variants/pageTransitionAnimations';
import { FullScreenError, FullScreenLoader } from '../../shared/ui/FullScreenState';
import { getPageTransitionRoute } from './pageTransitionRoute';

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

/** настраивает маршруты приложения и переходы между страницами */
export function AppRouter() {
    const location = useLocation();

    const transitionRoute = getPageTransitionRoute(location.pathname);

    const [settledRoute, setSettledRoute] = useState(transitionRoute);

    const direction: PageTransitionDirection = transitionRoute.key !== settledRoute.key && transitionRoute.rank < settledRoute.rank ? -1 : 1;

    return (
        <AnimatePresence
            initial={false}
            mode='wait'
            custom={direction}
        >
            <PageTransition
                key={transitionRoute.key}
                direction={direction}
                onAnimationComplete={() => {
                    setSettledRoute(transitionRoute);
                }}
            >
                <Suspense fallback={<FullScreenLoader label='Загрузка страницы...' />}>
                    <Routes location={location}>
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
            </PageTransition>
        </AnimatePresence>
    );
}
