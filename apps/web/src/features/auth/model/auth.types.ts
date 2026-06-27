export interface AuthOrganization {
    id: string;
    name: string;
    slug: string;
    roleKey: string;
    roleName: string;
}

export interface AuthUser {
    id: string;
    email: string;
    displayName: string;
    status: string;
    emailVerifiedAt: string | null;
    lastLoginAt: string | null;
    organizations: AuthOrganization[];
}

export interface RegisterPayload {
    email: string;
    displayName: string;
    password: string;
}

export interface LoginPayload {
    email: string;
    password: string;
}

export type AuthMode = 'login' | 'register';
