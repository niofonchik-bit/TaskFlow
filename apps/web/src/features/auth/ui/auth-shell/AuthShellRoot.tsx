import type { ReactNode } from 'react';
import { Box } from '@mui/material';
import { AuthBackground } from '../AuthBackground';
import styles from './AuthShell.module.css';
import { SystemThemeSync } from '../../../../app/theme/SystemThemeSync';

interface AuthShellRootProps {
    children: ReactNode;
}

/** отображает общую оболочку авторизации */
export function AuthShellRoot({ children }: AuthShellRootProps) {
    return (
        <Box
            component='main'
            className={styles.auth_root}
            sx={[
                {
                    background:
                        'radial-gradient(900px 620px at 12% 8%, rgba(242, 115, 77, 0.10), transparent 60%), radial-gradient(820px 600px at 88% 92%, rgba(244, 162, 59, 0.12), transparent 60%), linear-gradient(180deg, #FCF7F1, #F6EDE3)',
                },

                (theme) =>
                    theme.applyStyles('dark', {
                        background:
                            'radial-gradient(900px 620px at 12% 8%, rgba(255, 137, 102, 0.13), transparent 60%), radial-gradient(820px 600px at 88% 92%, rgba(111, 193, 187, 0.10), transparent 60%), linear-gradient(180deg, #171310, #211914)',
                    }),
            ]}
        >
            <SystemThemeSync />
            <AuthBackground />

            <Box className={styles.auth_content}>{children}</Box>
        </Box>
    );
}
