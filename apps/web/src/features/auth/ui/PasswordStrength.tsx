import { Box, Stack, Typography } from '@mui/material';
import { getPasswordStrength } from '../lib/getPasswordStrength';

interface PasswordStrengthProps {
    password: string;
}

/** отображает визуальную надёжность пароля */
export function PasswordStrength({ password }: PasswordStrengthProps) {
    const strength = getPasswordStrength(password);

    if (!strength.score) {
        return null;
    }

    return (
        <Stack spacing={1}>
            <Stack
                direction='row'
                spacing={0.75}
            >
                {[1, 2, 3, 4].map((segment) => (
                    <Box
                        key={segment}
                        sx={{
                            flex: 1,
                            height: 5,
                            borderRadius: '4px',
                            bgcolor: segment <= strength.score ? strength.color : '#ECE3DB',
                            transition: 'background-color 300ms',
                        }}
                    />
                ))}
            </Stack>

            <Typography
                sx={{
                    color: strength.color,
                    fontSize: 12,
                    fontWeight: 700,
                }}
            >
                Надёжность пароля: {strength.label}
            </Typography>
        </Stack>
    );
}
