import { useContext } from 'react';
import { AuthContext, type AuthContextValue } from './AuthContext';

/** возвращает состояние авторизации из provider */
export function useAuth(): AuthContextValue {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuth должен использоваться внутри AuthProvider');
    }

    return context;
}
