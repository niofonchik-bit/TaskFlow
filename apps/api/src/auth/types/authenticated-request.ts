import type { Request } from 'express';

export interface AuthenticatedUser {
  id: string;
  email: string;
  displayName: string;
  status: string;
  emailVerifiedAt: Date | null;
  sessionId: string;
}

export interface AuthenticatedRequest extends Request {
  user: AuthenticatedUser;
}
