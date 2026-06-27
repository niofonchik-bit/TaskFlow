import { Box, Stack, Typography } from '@mui/material';
import { mdiCheckboxMarkedCircleOutline } from '@mdi/js';
import { AppIcon } from '../../../../shared/ui/AppIcon';

/** отображает бренд TaskFlow */
export function AuthBrand() {
    return (
        <Stack
            direction='row'
            spacing={1.5}
            sx={{
                mb: 3.25,
                alignItems: 'center',
            }}
        >
            <Box
                sx={{
                    width: 46,
                    height: 46,
                    display: 'grid',
                    placeItems: 'center',
                    borderRadius: '14px',
                    color: 'primary.contrastText',
                    background: 'linear-gradient(135deg, var(--taskflow-palette-primary-main), var(--taskflow-palette-primary-dark))',
                    boxShadow: '0 12px 22px -8px rgba(232, 92, 57, 0.55)',
                }}
            >
                <AppIcon
                    path={mdiCheckboxMarkedCircleOutline}
                    sx={{ fontSize: 27 }}
                />
            </Box>

            <Box>
                <Typography
                    sx={{
                        color: 'text.primary',
                        fontSize: 25,
                        fontWeight: 800,
                        lineHeight: 1,
                        letterSpacing: '-0.02em',
                    }}
                >
                    TaskFlow
                </Typography>

                <Typography
                    sx={{
                        mt: 0.375,
                        color: 'text.secondary',
                        fontSize: '12.5px',
                        fontWeight: 600,
                    }}
                >
                    Задачи под контролем
                </Typography>
            </Box>
        </Stack>
    );
}
