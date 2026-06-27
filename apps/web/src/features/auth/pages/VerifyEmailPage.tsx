import { mdiEmailCheckOutline, mdiLogout } from '@mdi/js';
import { Alert, Box, Button, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppIcon } from '../../../shared/ui/AppIcon';
import { AppButton } from '../../../shared/ui/buttons/AppButton';
import { getAuthDestination } from '../lib/getAuthDestination';
import { useAuth } from '../model/useAuth';
import * as AuthShell from '../ui/auth-shell';

/** отображает временное подтверждение почты */
export function VerifyEmailPage() {
    const navigate = useNavigate();
    const { user, verifyEmailStub, logout } = useAuth();
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    /** подтверждает почту через временную заглушку */
    async function handleVerify() {
        setError(null);
        setIsSubmitting(true);

        try {
            const verifiedUser = await verifyEmailStub();

            navigate(getAuthDestination(verifiedUser), {
                replace: true,
            });
        } catch (requestError: unknown) {
            setError(requestError instanceof Error ? requestError.message : 'не удалось подтвердить почту');
        } finally {
            setIsSubmitting(false);
        }
    }

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
                    sx={{ alignItems: 'center' }}
                >
                    <Box
                        sx={{
                            width: 72,
                            height: 72,
                            display: 'grid',
                            placeItems: 'center',
                            borderRadius: '22px',
                            color: 'primary.main',
                            bgcolor: 'rgba(242, 115, 77, 0.12)',
                        }}
                    >
                        <AppIcon
                            path={mdiEmailCheckOutline}
                            sx={{ fontSize: 38 }}
                        />
                    </Box>

                    <Stack
                        spacing={1}
                        sx={{ textAlign: 'center' }}
                    >
                        <Typography
                            component='h1'
                            sx={{ fontSize: 26, fontWeight: 800 }}
                        >
                            Подтвердите почту
                        </Typography>

                        <Typography color='text.secondary'>Для продолжения работы нужно подтвердить адрес</Typography>

                        <Typography sx={{ fontWeight: 800 }}>{user?.email}</Typography>
                    </Stack>

                    <Alert severity='info'>Отправка писем пока не подключена. Кнопка ниже временно подтверждает текущий аккаунт без письма.</Alert>

                    {error && (
                        <Alert
                            severity='error'
                            sx={{ width: '100%' }}
                        >
                            {error}
                        </Alert>
                    )}

                    <AppButton
                        fullWidth
                        variant='contained'
                        isLoading={isSubmitting}
                        loadingText='Подтверждаем...'
                        onClick={() => {
                            void handleVerify();
                        }}
                        sx={{ height: 50 }}
                    >
                        Подтвердить email
                    </AppButton>

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
