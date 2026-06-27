export interface AuthOrganizationResponse {
  id: string;
  name: string;
  slug: string;
  roleKey: string;
  roleName: string;
}

export interface AuthUserResponse {
  id: string;
  email: string;
  displayName: string;
  status: string;
  emailVerifiedAt: Date | null;
  lastLoginAt: Date | null;
  organizations: AuthOrganizationResponse[];
}

export interface AuthSessionResponse {
  token: string;
  expiresAt: Date;
  sessionId: string;
}

export interface AuthResultResponse {
  user: AuthUserResponse;
  session: AuthSessionResponse;
}
