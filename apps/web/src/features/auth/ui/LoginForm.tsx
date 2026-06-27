import { useState, type Dispatch, type FormEvent, type SetStateAction } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert, Box, Divider, Snackbar, Stack, Typography } from '@mui/material';
import { mdiEmailOutline, mdiGoogle } from '@mdi/js';
import { AppButton } from '../../../shared/ui/buttons/AppButton';
import { AppTextField } from '../../../shared/ui/fields/AppTextField';
import { PasswordField } from '../../../shared/ui/fields/PasswordField';
import { AppIcon } from '../../../shared/ui/AppIcon';
import { getAuthDestination } from '../lib/getAuthDestination';
import type { LoginFormValues } from '../model/authForm.types';
import { useAuth } from '../model/useAuth';
import { AuthFormHeader } from './AuthFormHeader';

interface LoginFormProps {
    values: LoginFormValues;
    onChange: Dispatch<SetStateAction<LoginFormValues>>;
    onShowRegister: () => void;
}

/** отображает форму входа */
export function LoginForm({ values, onChange, onShowRegister }: LoginFormProps) {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [error, setError] = useState<string | null>(null);

    const [notice, setNotice] = useState<string | null>(null);

    const [isSubmitting, setIsSubmitting] = useState(false);

    /** отправляет форму входа */
    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        setError(null);
        setIsSubmitting(true);

        try {
            const user = await login({
                email: values.email,
                password: values.password,
            });

            navigate(getAuthDestination(user), {
                replace: true,
            });
        } catch (requestError: unknown) {
            setError(requestError instanceof Error ? requestError.message : 'не удалось войти');
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Box
            component='form'
            onSubmit={handleSubmit}
        >
            <AuthFormHeader
                eyebrow='С возвращением'
                title='Войдите в аккаунт'
                description='Продолжите работу с задачами TaskFlow'
            />

            <Stack
                spacing={2}
                sx={{ mt: 3 }}
            >
                <AppTextField
                    label='Email'
                    type='email'
                    value={values.email}
                    placeholder='you@company.com'
                    autoComplete='email'
                    required
                    startIcon={
                        <AppIcon
                            path={mdiEmailOutline}
                            sx={{
                                color: 'text.secondary',
                                fontSize: 19,
                            }}
                        />
                    }
                    onChange={(event) => {
                        onChange((currentValues) => ({
                            ...currentValues,
                            email: event.target.value,
                        }));
                    }}
                />

                <Stack spacing={0.5}>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                        }}
                    >
                        <AppButton
                            type='button'
                            variant='text'
                            size='small'
                            onClick={() => {
                                setNotice('Восстановление пароля будет добавлено позже');
                            }}
                            sx={{
                                minWidth: 0,
                                p: 0,
                                fontSize: 12,
                            }}
                        >
                            Забыли пароль?
                        </AppButton>
                    </Box>

                    <PasswordField
                        label='Пароль'
                        value={values.password}
                        placeholder='Введите пароль'
                        autoComplete='current-password'
                        required
                        inputProps={{
                            maxLength: 128,
                        }}
                        onChange={(event) => {
                            onChange((currentValues) => ({
                                ...currentValues,
                                password: event.target.value,
                            }));
                        }}
                    />
                </Stack>

                {error && <Alert severity='error'>{error}</Alert>}

                <AppButton
                    type='submit'
                    fullWidth
                    variant='contained'
                    isLoading={isSubmitting}
                    loadingText='Входим...'
                    sx={{
                        height: 52,
                        background: 'linear-gradient(135deg, var(--taskflow-palette-primary-main), var(--taskflow-palette-primary-dark))',
                        boxShadow: '0 12px 22px -8px rgba(232, 92, 57, 0.60)',

                        '&:hover': {
                            background: 'linear-gradient(135deg, var(--taskflow-palette-primary-light), var(--taskflow-palette-primary-main))',
                            transform: 'translateY(-1px)',
                        },
                    }}
                >
                    Войти
                </AppButton>

                <Divider>
                    <Typography
                        sx={{
                            color: 'text.secondary',
                            fontSize: 12,
                            fontWeight: 600,
                        }}
                    >
                        или
                    </Typography>
                </Divider>

                <AppButton
                    type='button'
                    variant='outlined'
                    startIcon={<AppIcon path={mdiGoogle} />}
                    onClick={() => {
                        setNotice('Вход через Google будет добавлен позже');
                    }}
                    sx={{
                        height: 48,
                        borderColor: 'divider',
                        color: 'text.primary',
                        bgcolor: 'background.paper',

                        '&:hover': {
                            borderColor: 'text.secondary',
                            bgcolor: 'action.hover',
                        },
                    }}
                >
                    Продолжить с Google
                </AppButton>
            </Stack>

            <Box
                sx={{
                    pt: 2.5,
                    textAlign: 'center',
                    color: 'text.secondary',
                    fontSize: 14,
                    fontWeight: 600,
                }}
            >
                Нет аккаунта?{' '}
                <AppButton
                    type='button'
                    variant='text'
                    onClick={onShowRegister}
                    sx={{
                        minWidth: 0,
                        p: 0,
                        verticalAlign: 'baseline',
                    }}
                >
                    Зарегистрируйтесь
                </AppButton>
            </Box>

            <Snackbar
                open={Boolean(notice)}
                autoHideDuration={3500}
                onClose={() => {
                    setNotice(null);
                }}
                message={notice}
            />
        </Box>
    );
}
