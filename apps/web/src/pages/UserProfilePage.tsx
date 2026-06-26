import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';

/** форматирует дату для страницы профиля */
function formatProfileDate(value: string | null): string {
    if (!value) {
        return 'не указано';
    }

    return new Date(value).toLocaleString('ru-RU');
}

/** отображает тестовую страницу текущего пользователя */
export function UserProfilePage() {
    const navigate = useNavigate();
    const { logout, user } = useAuth();

    /** завершает сессию и возвращает на вход */
    async function handleLogout() {
        await logout();
        navigate('/login', { replace: true });
    }

    if (!user) {
        return null;
    }

    return (
        <main className='profile_page'>
            <section className='profile_section'>
                <div className='profile_header'>
                    <h1>{user.displayName}</h1>

                    <button type='button' onClick={handleLogout}>
                        Выйти
                    </button>
                </div>

                <dl className='profile_list'>
                    <div>
                        <dt>ID</dt>
                        <dd>{user.id}</dd>
                    </div>
                    <div>
                        <dt>Почта</dt>
                        <dd>{user.email}</dd>
                    </div>
                    <div>
                        <dt>Статус</dt>
                        <dd>{user.status}</dd>
                    </div>
                    <div>
                        <dt>Почта подтверждена</dt>
                        <dd>{formatProfileDate(user.emailVerifiedAt)}</dd>
                    </div>
                    <div>
                        <dt>Последний вход</dt>
                        <dd>{formatProfileDate(user.lastLoginAt)}</dd>
                    </div>
                </dl>
            </section>

            <section className='profile_section'>
                <h2>Организации</h2>

                <ul className='profile_organization_list'>
                    {user.organizations.map((organization) => (
                        <li
                            key={organization.id}
                            className='profile_organization'
                        >
                            <strong>{organization.name}</strong>
                            <span>{organization.slug}</span>
                            <span>
                                {organization.roleName} ({organization.roleKey})
                            </span>
                        </li>
                    ))}
                </ul>
            </section>
        </main>
    );
}
