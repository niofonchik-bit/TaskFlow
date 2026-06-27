export interface PageTransitionRoute {
    key: string;
    rank: number;
}

/** группирует адреса по визуальным страницам и задает порядок переходов */
export function getPageTransitionRoute(pathname: string): PageTransitionRoute {
    if (pathname === '/login' || pathname === '/register') {
        return {
            key: 'auth_credentials',
            rank: 0,
        };
    }

    if (pathname === '/verify-email') {
        return {
            key: 'auth_verify_email',
            rank: 1,
        };
    }

    if (pathname === '/onboarding') {
        return {
            key: 'auth_onboarding',
            rank: 2,
        };
    }

    if (pathname === '/me') {
        return {
            key: 'workspace_profile',
            rank: 3,
        };
    }

    return {
        key: pathname,
        rank: 4,
    };
}
