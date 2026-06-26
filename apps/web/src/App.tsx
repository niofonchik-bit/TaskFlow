import { Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import { GuestRoute } from './auth/GuestRoute';
import { ProtectedRoute } from './auth/ProtectedRoute';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { UserProfilePage } from './pages/UserProfilePage';
import TestRecordsPage from './pages/TestRecordsPage';

/** настраивает маршруты приложения */
export default function App() {
    return (
        <Routes>
            <Route element={<GuestRoute />}>
                <Route path='/login' element={<LoginPage />} />
                <Route path='/register' element={<RegisterPage />} />
            </Route>

            <Route element={<ProtectedRoute />}>
                <Route path='/me' element={<UserProfilePage />} />
                <Route path='/test' element={<TestRecordsPage />} />
            </Route>

            <Route path='*' element={<Navigate to='/me' replace />} />
        </Routes>
    );
}
