import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';

/** отображает форму регистрации */
export function RegisterPage() {
    const navigate = useNavigate();
    const { register } = useAuth();
    const [email, setEmail] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [organizationName, setOrganizationName] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    /** отправляет форму регистрации */
    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError(null);
        setIsSubmitting(true);

        try {
            await register({
                email,
                password,
                displayName,
                organizationName,
            });
            navigate('/me', { replace: true });
        } catch (requestError: unknown) {
            setError(
                requestError instanceof Error
                    ? requestError.message
                    : 'не удалось создать аккаунт',
            );
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <main className='auth_page'>
            <form className='auth_form' onSubmit={handleSubmit}>
                <h1>Регистрация</h1>

                <label className='auth_field'>
                    <span>Почта</span>
                    <input
                        value={email}
                        type='email'
                        autoComplete='email'
                        required
                        onChange={(event) => setEmail(event.target.value)}
                    />
                </label>

                <label className='auth_field'>
                    <span>Имя</span>
                    <input
                        value={displayName}
                        type='text'
                        autoComplete='name'
                        required
                        onChange={(event) => setDisplayName(event.target.value)}
                    />
                </label>

                <label className='auth_field'>
                    <span>Организация</span>
                    <input
                        value={organizationName}
                        type='text'
                        required
                        onChange={(event) =>
                            setOrganizationName(event.target.value)
                        }
                    />
                </label>

                <label className='auth_field'>
                    <span>Пароль</span>
                    <input
                        value={password}
                        type='password'
                        autoComplete='new-password'
                        minLength={6}
                        required
                        onChange={(event) => setPassword(event.target.value)}
                    />
                </label>

                {error && (
                    <p className='auth_error' role='alert'>
                        {error}
                    </p>
                )}

                <button type='submit' disabled={isSubmitting}>
                    {isSubmitting ? 'Создание...' : 'Создать аккаунт'}
                </button>

                <Link to='/login'>Уже есть аккаунт</Link>
            </form>
        </main>
    );
}
