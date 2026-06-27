import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { AuthMode } from '../model/auth.types';
import { INITIAL_LOGIN_FORM_VALUES, INITIAL_REGISTER_FORM_VALUES, type LoginFormValues, type RegisterFormValues } from '../model/authForm.types';
import * as AuthShell from '../ui/auth-shell';
import { AuthCardTransition } from '../ui/AuthCardTransition';
import { LoginForm } from '../ui/LoginForm';
import { RegisterForm } from '../ui/RegisterForm';

/** отображает вход и регистрацию */
export function AuthPage() {
    const location = useLocation();
    const navigate = useNavigate();

    const mode: AuthMode = location.pathname === '/register' ? 'register' : 'login';

    const [loginValues, setLoginValues] = useState<LoginFormValues>(INITIAL_LOGIN_FORM_VALUES);

    const [registerValues, setRegisterValues] = useState<RegisterFormValues>(INITIAL_REGISTER_FORM_VALUES);

    const direction: 1 | -1 = mode === 'register' ? 1 : -1;

    /** изменяет режим и синхронизирует URL */
    function handleModeChange(nextMode: AuthMode) {
        navigate(nextMode === 'login' ? '/login' : '/register');
    }

    return (
        <AuthShell.Root>
            <AuthShell.Brand />

            <AuthShell.ModeSwitch
                mode={mode}
                onChange={handleModeChange}
            />

            <AuthCardTransition
                mode={mode}
                direction={direction}
            >
                <AuthShell.Card>
                    {mode === 'login' ? (
                        <LoginForm
                            values={loginValues}
                            onChange={setLoginValues}
                            onShowRegister={() => {
                                handleModeChange('register');
                            }}
                        />
                    ) : (
                        <RegisterForm
                            values={registerValues}
                            onChange={setRegisterValues}
                            onShowLogin={() => {
                                handleModeChange('login');
                            }}
                        />
                    )}
                </AuthShell.Card>
            </AuthCardTransition>
        </AuthShell.Root>
    );
}
