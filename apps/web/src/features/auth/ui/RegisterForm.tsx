import { useState, type Dispatch, type FormEvent, type SetStateAction } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert, Box, Divider, Snackbar, Stack, Typography } from '@mui/material';
import { mdiAccountOutline, mdiEmailOutline, mdiGoogle } from '@mdi/js';
import { AppButton } from '../../../shared/ui/buttons/AppButton';
import { AppTextField } from '../../../shared/ui/fields/AppTextField';
import { PasswordField } from '../../../shared/ui/fields/PasswordField';
import { AppIcon } from '../../../shared/ui/AppIcon';
import { getAuthDestination } from '../lib/getAuthDestination';
import type { RegisterFormValues } from '../model/authForm.types';
import { useAuth } from '../model/useAuth';
import { AuthFormHeader } from './AuthFormHeader';
import { PasswordStrength } from './PasswordStrength';

interface RegisterFormProps {
    values: RegisterFormValues;
    onChange: Dispatch<SetStateAction<RegisterFormValues>>;
    onShowLogin: () => void;
}

/** отображает форму регистрации */
export function RegisterForm({ values, onChange, onShowLogin }: RegisterFormProps) {
    const navigate = useNavigate();
    const { register } = useAuth();

    const [isSubmitted, setIsSubmitted] = useState(false);

    const [error, setError] = useState<string | null>(null);

    const [noticeOpen, setNoticeOpen] = useState(false);

    const [isSubmitting, setIsSubmitting] = useState(false);

    const passwordsMismatch = (isSubmitted || values.confirmPassword.length > 0) && values.password !== values.confirmPassword;

    /** отправляет форму регистрации */
    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        setIsSubmitted(true);
        setError(null);

        if (passwordsMismatch) {
            return;
        }

        setIsSubmitting(true);

        try {
            const user = await register({
                displayName: values.displayName,
                email: values.email,
                password: values.password,
            });

            navigate(getAuthDestination(user), {
                replace: true,
            });
        } catch (requestError: unknown) {
            setError(requestError instanceof Error ? requestError.message : 'не удалось создать аккаунт');
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
                eyebrow='Привет!'
                title='Создайте аккаунт'
                description='Несколько шагов — и можно начинать'
            />

            <Stack
                spacing={1.75}
                sx={{ mt: 2.5 }}
            >
                <AppTextField
                    label='Имя'
                    value={values.displayName}
                    placeholder='Как вас зовут?'
                    autoComplete='name'
                    required
                    inputProps={{
                        minLength: 2,
                        maxLength: 80,
                    }}
                    startIcon={
                        <AppIcon
                            path={mdiAccountOutline}
                            sx={{
                                color: 'text.secondary',
                                fontSize: 19,
                            }}
                        />
                    }
                    onChange={(event) => {
                        onChange((currentValues) => ({
                            ...currentValues,
                            displayName: event.target.value,
                        }));
                    }}
                />

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

                <PasswordField
                    label='Пароль'
                    value={values.password}
                    placeholder='Придумайте пароль'
                    autoComplete='new-password'
                    required
                    inputProps={{
                        minLength: 8,
                        maxLength: 128,
                    }}
                    onChange={(event) => {
                        onChange((currentValues) => ({
                            ...currentValues,
                            password: event.target.value,
                        }));
                    }}
                />

                <PasswordStrength password={values.password} />

                <PasswordField
                    label='Подтвердите пароль'
                    value={values.confirmPassword}
                    placeholder='Повторите пароль'
                    autoComplete='new-password'
                    required
                    error={passwordsMismatch}
                    helperText={passwordsMismatch ? 'Пароли не совпадают' : undefined}
                    inputProps={{
                        minLength: 8,
                        maxLength: 128,
                    }}
                    onChange={(event) => {
                        onChange((currentValues) => ({
                            ...currentValues,
                            confirmPassword: event.target.value,
                        }));
                    }}
                />

                {error && <Alert severity='error'>{error}</Alert>}

                <AppButton
                    type='submit'
                    fullWidth
                    variant='contained'
                    isLoading={isSubmitting}
                    loadingText='Создаём...'
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
                    Создать аккаунт
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
                        setNoticeOpen(true);
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
                    pt: 2,
                    textAlign: 'center',
                    color: 'text.secondary',
                    fontSize: 14,
                    fontWeight: 600,
                }}
            >
                Уже есть аккаунт?{' '}
                <AppButton
                    type='button'
                    variant='text'
                    onClick={onShowLogin}
                    sx={{
                        minWidth: 0,
                        p: 0,
                        verticalAlign: 'baseline',
                    }}
                >
                    Войти
                </AppButton>
            </Box>

            <Snackbar
                open={noticeOpen}
                autoHideDuration={3500}
                onClose={() => {
                    setNoticeOpen(false);
                }}
                message='Вход через Google будет добавлен позже'
            />
        </Box>
    );
}
