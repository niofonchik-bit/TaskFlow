import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';

/** отображает форму входа */
export function LoginPage() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    /** отправляет форму входа */
    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError(null);
        setIsSubmitting(true);

        try {
            await login({ email, password });
            navigate('/me', { replace: true });
        } catch (requestError: unknown) {
            setError(
                requestError instanceof Error
                    ? requestError.message
                    : 'не удалось войти',
            );
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <main className='auth_page'>
            <form className='auth_form' onSubmit={handleSubmit}>
                <h1>Вход</h1>

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
                    <span>Пароль</span>
                    <input
                        value={password}
                        type='password'
                        autoComplete='current-password'
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
                    {isSubmitting ? 'Вход...' : 'Войти'}
                </button>

                <Link to='/register'>Создать аккаунт</Link>
            </form>
        </main>
    );
}
