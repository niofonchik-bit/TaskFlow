import type { ReactNode } from 'react';
import { Paper } from '@mui/material';

interface AuthSingleCardProps {
    children: ReactNode;
}

/** отображает одиночную карточку авторизации */
export function AuthSingleCard({ children }: AuthSingleCardProps) {
    return (
        <Paper
            elevation={0}
            sx={[
                {
                    width: 'min(420px, calc(100vw - 32px))',
                    p: 4.5,
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: '26px',
                    bgcolor: 'background.paper',
                    boxShadow: '0 32px 64px -22px rgba(120, 72, 45, 0.30), 0 8px 22px -10px rgba(120, 72, 45, 0.16)',
                },

                (theme) =>
                    theme.applyStyles('dark', {
                        boxShadow: '0 34px 78px -24px rgba(0, 0, 0, 0.72)',
                    }),
            ]}
        >
            {children}
        </Paper>
    );
}
