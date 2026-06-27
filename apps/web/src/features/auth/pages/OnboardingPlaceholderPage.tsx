import { useNavigate } from 'react-router-dom';
import { Box, Button, Stack, Typography } from '@mui/material';
import { mdiCheckCircleOutline, mdiLogout } from '@mdi/js';
import { useAuth } from '../model/useAuth';
import { AppIcon } from '../../../shared/ui/AppIcon';
import * as AuthShell from '../ui/auth-shell';

/** отображает завершение первого этапа регистрации */
export function OnboardingPlaceholderPage() {
    const navigate = useNavigate();
    const { logout } = useAuth();

    /** завершает текущую сессию */
    async function handleLogout() {
        await logout();
        navigate('/login', { replace: true });
    }

    return (
        <AuthShell.Root>
            <AuthShell.Brand />

            <AuthShell.SingleCard>
                <Stack
                    spacing={3}
                    sx={{
                        alignItems: 'center',
                        textAlign: 'center',
                    }}
                >
                    <Box
                        sx={{
                            width: 72,
                            height: 72,
                            display: 'grid',
                            placeItems: 'center',
                            borderRadius: '22px',
                            color: '#3F9A5C',
                            bgcolor: 'rgba(63, 154, 92, 0.12)',
                        }}
                    >
                        <AppIcon
                            path={mdiCheckCircleOutline}
                            sx={{ fontSize: 40 }}
                        />
                    </Box>

                    <Stack spacing={1}>
                        <Typography
                            component='h1'
                            sx={{ fontSize: 26, fontWeight: 800 }}
                        >
                            Аккаунт готов
                        </Typography>

                        <Typography color='text.secondary'>Регистрация и подтверждение почты завершены.</Typography>

                        <Typography color='text.secondary'>Создание организации будет реализовано следующим отдельным этапом.</Typography>
                    </Stack>

                    <Button
                        variant='text'
                        startIcon={<AppIcon path={mdiLogout} />}
                        onClick={() => void handleLogout()}
                    >
                        Выйти из аккаунта
                    </Button>
                </Stack>
            </AuthShell.SingleCard>
        </AuthShell.Root>
    );
}
