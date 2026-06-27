import { Stack, Typography } from '@mui/material';

interface AuthFormHeaderProps {
    eyebrow: string;
    title: string;
    description: string;
}

/** отображает заголовок формы авторизации */
export function AuthFormHeader({ eyebrow, title, description }: AuthFormHeaderProps) {
    return (
        <Stack spacing={0.5}>
            <Typography
                sx={{
                    color: 'primary.main',
                    fontFamily: '"Newsreader", serif',
                    fontSize: 15,
                    fontStyle: 'italic',
                    fontWeight: 500,
                }}
            >
                {eyebrow}
            </Typography>

            <Typography
                component='h1'
                sx={{
                    color: 'text.primary',
                    fontSize: 24,
                    fontWeight: 800,
                    letterSpacing: '-0.01em',
                }}
            >
                {title}
            </Typography>

            <Typography
                sx={{
                    color: 'text.secondary',
                    fontSize: 14,
                    fontWeight: 500,
                }}
            >
                {description}
            </Typography>
        </Stack>
    );
}
