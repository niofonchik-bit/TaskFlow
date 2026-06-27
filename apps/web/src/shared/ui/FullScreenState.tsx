import { Box, Button, CircularProgress, Paper, Stack, Typography } from '@mui/material';

interface FullScreenLoaderProps {
    label?: string;
}

/** отображает полноэкранную загрузку */
export function FullScreenLoader({ label = 'Проверка сессии...' }: FullScreenLoaderProps) {
    return (
        <Box
            component='main'
            sx={{
                minHeight: '100dvh',
                display: 'grid',
                placeItems: 'center',
                bgcolor: 'background.default',
            }}
        >
            <Stack
                spacing={2}
                sx={{
                    alignItems: 'center',
                }}
            >
                <CircularProgress size={34} />
                <Typography color='text.secondary'>{label}</Typography>
            </Stack>
        </Box>
    );
}

interface FullScreenErrorProps {
    message: string;
    onRetry: () => void;
}

/** отображает ошибку начальной загрузки */
export function FullScreenError({ message, onRetry }: FullScreenErrorProps) {
    return (
        <Box
            component='main'
            sx={{
                minHeight: '100dvh',
                display: 'grid',
                placeItems: 'center',
                p: 3,
                bgcolor: 'background.default',
            }}
        >
            <Paper
                sx={{
                    width: 'min(100%, 420px)',
                    p: 4,
                    borderRadius: '24px',
                    textAlign: 'center',
                }}
            >
                <Stack spacing={2}>
                    <Typography
                        variant='h5'
                        sx={{ fontWeight: 800 }}
                    >
                        Не удалось открыть TaskFlow
                    </Typography>

                    <Typography color='text.secondary'>{message}</Typography>

                    <Button
                        variant='contained'
                        onClick={onRetry}
                    >
                        Повторить
                    </Button>
                </Stack>
            </Paper>
        </Box>
    );
}
