import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './useAuth';

/** закрывает гостевые страницы от авторизованных пользователей */
export function GuestRoute() {
    const { isLoading, user } = useAuth();

    if (isLoading) {
        return <main className='auth_page'>Загрузка...</main>;
    }

    if (user) {
        return <Navigate to='/me' replace />;
    }

    return <Outlet />;
}
