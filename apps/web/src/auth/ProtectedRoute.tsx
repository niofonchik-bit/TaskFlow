import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './useAuth';

/** закрывает маршрут от неавторизованных пользователей */
export function ProtectedRoute() {
    const { isLoading, user } = useAuth();

    if (isLoading) {
        return <main className='auth_page'>Загрузка...</main>;
    }

    if (!user) {
        return <Navigate to='/login' replace />;
    }

    return <Outlet />;
}
