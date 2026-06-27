import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AppThemeProvider } from './app/theme/AppThemeProvider';
import { AuthProvider } from './features/auth/model/AuthProvider';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <AppThemeProvider>
                <AuthProvider>
                    <App />
                </AuthProvider>
            </AppThemeProvider>
        </BrowserRouter>
    </StrictMode>,
);
