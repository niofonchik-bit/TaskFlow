import { useColorScheme } from '@mui/material/styles';

export type AppThemeMode = 'light' | 'dark' | 'system';
export type ResolvedThemeMode = 'light' | 'dark';

/** предоставляет текущую тему и изменение режима */
export function useThemeMode() {
    const { mode, systemMode, setMode } = useColorScheme();

    const selectedMode = (mode ?? 'system') as AppThemeMode;

    const resolvedMode: ResolvedThemeMode = selectedMode === 'system' ? ((systemMode ?? 'light') as ResolvedThemeMode) : selectedMode;

    /** изменяет режим темы */
    function changeMode(nextMode: AppThemeMode) {
        setMode(nextMode);
    }

    return {
        mode: selectedMode,
        resolvedMode,
        changeMode,
    };
}
