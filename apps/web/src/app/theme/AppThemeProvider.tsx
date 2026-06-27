import type { ReactNode } from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { appTheme } from './appTheme';
import { AppMotionProvider } from '../../shared/animation/model/AppMotionProvider';

interface AppThemeProviderProps {
    children: ReactNode;
}

/** предоставляет темы и анимации всему приложению */
export function AppThemeProvider({ children }: AppThemeProviderProps) {
    return (
        <ThemeProvider
            theme={appTheme}
            defaultMode='system'
            noSsr
        >
            <CssBaseline />

            <AppMotionProvider>{children}</AppMotionProvider>
        </ThemeProvider>
    );
}
