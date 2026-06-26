import type { Request } from 'express';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import type { AuthenticatedUser } from './types/authenticated-request';
import type { AuthSessionResponse } from './types/auth-response.types';
import {
  getSessionCookieName,
  getSessionTtlMs,
  readCookie,
} from './utils/cookie.utils';
import { getRequestIp, getUserAgent } from './utils/request.utils';
import { createSecureToken, hashToken } from './utils/token.utils';

export interface ResolvedSession {
  sessionId: string;
  user: AuthenticatedUser;
}

/** управляет серверными сессиями */
@Injectable()
export class SessionService {
  /** создает сервис сессий */
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  /** создает сессию и возвращает raw token только вызывающему коду */
  async createSession(
    userId: string,
    request: Request,
  ): Promise<AuthSessionResponse> {
    const token = createSecureToken();
    const expiresAt = new Date(
      Date.now() + getSessionTtlMs(this.configService),
    );
    const session = await this.prisma.sessions.create({
      data: {
        user_id: userId,
        token_hash: hashToken(token, this.getSecret()),
        expires_at: expiresAt,
        ip_address: getRequestIp(request),
        user_agent: getUserAgent(request),
      },
      select: {
        id: true,
      },
    });

    return {
      token,
      expiresAt,
      sessionId: session.id,
    };
  }

  /** находит активную сессию по cookie */
  async resolveSession(request: Request): Promise<ResolvedSession | null> {
    const cookieName = getSessionCookieName(this.configService);
    const token = readCookie(request, cookieName);

    if (!token) {
      return null;
    }

    const session = await this.prisma.sessions.findUnique({
      where: {
        token_hash: hashToken(token, this.getSecret()),
      },
    });

    if (!session || session.revoked_at || session.expires_at <= new Date()) {
      return null;
    }

    const user = await this.prisma.users.findFirst({
      where: {
        id: session.user_id,
        archived_at: null,
        status: 'active',
      },
      select: {
        id: true,
        email: true,
        display_name: true,
        status: true,
        email_verified_at: true,
      },
    });

    if (!user) {
      return null;
    }

    await this.touchSession(session.id);

    return {
      sessionId: session.id,
      user: {
        id: user.id,
        email: user.email,
        displayName: user.display_name,
        status: user.status,
        emailVerifiedAt: user.email_verified_at,
        sessionId: session.id,
      },
    };
  }

  /** отзывает конкретную сессию */
  async revokeSession(sessionId: string): Promise<void> {
    await this.prisma.sessions.update({
      where: {
        id: sessionId,
      },
      data: {
        revoked_at: new Date(),
      },
    });
  }

  /** обновляет время последней активности */
  private async touchSession(sessionId: string): Promise<void> {
    await this.prisma.sessions.update({
      where: {
        id: sessionId,
      },
      data: {
        last_active_at: new Date(),
      },
    });
  }

  /** получает секрет для HMAC session token */
  private getSecret(): string {
    return this.configService.getOrThrow<string>('AUTH_SESSION_SECRET');
  }
}
