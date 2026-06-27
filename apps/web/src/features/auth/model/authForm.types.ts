export interface LoginFormValues {
    email: string;
    password: string;
}

export interface RegisterFormValues {
    displayName: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export const INITIAL_LOGIN_FORM_VALUES: LoginFormValues = {
    email: '',
    password: '',
};

export const INITIAL_REGISTER_FORM_VALUES: RegisterFormValues = {
    displayName: '',
    email: '',
    password: '',
    confirmPassword: '',
};
