import type { ReactNode } from 'react';
import { Paper } from '@mui/material';

interface AuthCardProps {
    children: ReactNode;
}

/** отображает карточку формы авторизации */
export function AuthCard({ children }: AuthCardProps) {
    return (
        <Paper
            elevation={0}
            sx={[
                {
                    display: 'flex',
                    flexDirection: 'column',
                    width: 'min(384px, calc(100vw - 32px))',
                    overflow: 'hidden',
                    p: '32px 32px 28px',
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: '26px',
                    bgcolor: 'background.paper',
                    boxShadow: '0 32px 64px -22px rgba(120, 72, 45, 0.30), 0 8px 22px -10px rgba(120, 72, 45, 0.16)',
                },

                (theme) =>
                    theme.applyStyles('dark', {
                        boxShadow: '0 34px 78px -24px rgba(0, 0, 0, 0.72), 0 8px 24px -12px rgba(0, 0, 0, 0.55)',
                    }),

                {
                    '@media (max-width: 700px)': {
                        p: '28px 22px 24px',
                    },
                },
            ]}
        >
            {children}
        </Paper>
    );
}
