import { useEffect } from 'react';
import { useColorScheme } from '@mui/material/styles';

/** принудительно применяет системную тему */
export function SystemThemeSync() {
    const { mode, setMode } = useColorScheme();

    useEffect(() => {
        if (mode !== 'system') {
            setMode('system');
        }
    }, [mode, setMode]);

    return null;
}
