import type { Request } from 'express';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AUTH_EMAIL_TOKEN_TTL_HOURS } from './constants/auth.constants';
import { getRequestIp } from './utils/request.utils';
import { createSecureToken, hashToken } from './utils/token.utils';

type PrismaWriter = PrismaService | Prisma.TransactionClient;

export interface EmailVerificationToken {
  token: string;
  expiresAt: Date;
}

/** управляет подтверждением почты */
@Injectable()
export class EmailVerificationService {
  /** создает сервис подтверждения почты */
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  /** создает одноразовый токен подтверждения почты */
  async createVerificationToken(
    userId: string,
    email: string,
    request: Request,
    client: PrismaWriter = this.prisma,
  ): Promise<EmailVerificationToken> {
    const token = createSecureToken();
    const expiresAt = new Date(
      Date.now() + AUTH_EMAIL_TOKEN_TTL_HOURS * 60 * 60 * 1000,
    );

    await client.email_verification_tokens.create({
      data: {
        user_id: userId,
        email,
        token_hash: hashToken(token, this.getSecret()),
        expires_at: expiresAt,
        requested_ip: getRequestIp(request),
      },
    });

    return {
      token,
      expiresAt,
    };
  }

  /** подтверждает почту по одноразовому токену */
  async verifyEmail(token: string): Promise<void> {
    const tokenHash = hashToken(token, this.getSecret());
    const verificationToken =
      await this.prisma.email_verification_tokens.findUnique({
        where: {
          token_hash: tokenHash,
        },
      });

    if (
      !verificationToken ||
      verificationToken.consumed_at ||
      verificationToken.expires_at <= new Date()
    ) {
      throw new BadRequestException('токен подтверждения почты недействителен');
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.email_verification_tokens.update({
        where: {
          id: verificationToken.id,
        },
        data: {
          consumed_at: new Date(),
        },
      });

      await tx.users.update({
        where: {
          id: verificationToken.user_id,
        },
        data: {
          email_verified_at: new Date(),
          updated_at: new Date(),
        },
      });
    });
  }

  /** подтверждает почту текущего пользователя без отправки письма */
  async verifyCurrentUserStub(userId: string): Promise<void> {
    const verifiedAt = new Date();

    await this.prisma.$transaction(async (tx) => {
      await tx.users.updateMany({
        where: {
          id: userId,
          archived_at: null,
          email_verified_at: null,
        },
        data: {
          email_verified_at: verifiedAt,
          updated_at: verifiedAt,
        },
      });

      await tx.email_verification_tokens.updateMany({
        where: {
          user_id: userId,
          consumed_at: null,
        },
        data: {
          consumed_at: verifiedAt,
        },
      });
    });
  }

  /** получает секрет для HMAC verification token */
  private getSecret(): string {
    return this.configService.getOrThrow<string>('AUTH_SESSION_SECRET');
  }
}
