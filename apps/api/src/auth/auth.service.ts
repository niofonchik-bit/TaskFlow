import type { Request } from 'express';
import {
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import {
  AUTH_LOCK_MINUTES,
  AUTH_LOGIN_LOCK_LIMIT,
} from './constants/auth.constants';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { EmailVerificationService } from './email-verification.service';
import { PasswordService } from './password.service';
import { SessionService } from './session.service';
import type {
  AuthResultResponse,
  AuthUserResponse,
} from './types/auth-response.types';
import { createOrganizationSlug } from './utils/slug.utils';

/** управляет регистрацией, входом и профилем текущего пользователя */
@Injectable()
export class AuthService {
  /** создает auth-сервис */
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly passwordService: PasswordService,
    private readonly sessionService: SessionService,
    private readonly emailVerificationService: EmailVerificationService,
  ) {}

  /** регистрирует пользователя и первую организацию */
  async register(
    dto: RegisterDto,
    request: Request,
  ): Promise<AuthResultResponse> {
    const email = this.normalizeEmail(dto.email);
    const existingUser = await this.prisma.users.findFirst({
      where: {
        email,
        archived_at: null,
      },
      select: {
        id: true,
      },
    });

    if (existingUser) {
      throw new ConflictException(
        'не удалось создать аккаунт с указанными данными',
      );
    }

    const passwordHash = await this.passwordService.hashPassword(dto.password);
    let devEmailVerificationToken: string | undefined;

    const createdUser = await this.prisma.$transaction(async (tx) => {
      const ownerRole = await tx.roles.findFirst({
        where: {
          organization_id: null,
          key: 'owner',
        },
      });

      if (!ownerRole) {
        throw new InternalServerErrorException(
          'системная роль owner не создана',
        );
      }

      const user = await tx.users.create({
        data: {
          email,
          password_hash: passwordHash,
          display_name: dto.displayName,
        },
        select: {
          id: true,
        },
      });

      const organization = await tx.organizations.create({
        data: {
          name: dto.organizationName,
          slug: createOrganizationSlug(dto.organizationName, email),
          owner_user_id: user.id,
          created_by_id: user.id,
          updated_by_id: user.id,
        },
        select: {
          id: true,
        },
      });

      await tx.organization_members.create({
        data: {
          organization_id: organization.id,
          user_id: user.id,
          role_id: ownerRole.id,
        },
      });

      const verificationToken =
        await this.emailVerificationService.createVerificationToken(
          user.id,
          email,
          request,
          tx,
        );

      devEmailVerificationToken = verificationToken.token;

      return user;
    });

    const session = await this.sessionService.createSession(
      createdUser.id,
      request,
    );
    const user = await this.getMe(createdUser.id);

    return {
      user,
      session,
      devEmailVerificationToken: this.shouldExposeDevEmailToken()
        ? devEmailVerificationToken
        : undefined,
    };
  }

  /** создает новую сессию после проверки пароля */
  async login(dto: LoginDto, request: Request): Promise<AuthResultResponse> {
    const email = this.normalizeEmail(dto.email);
    const user = await this.prisma.users.findFirst({
      where: {
        email,
        archived_at: null,
      },
    });

    if (!user) {
      throw this.createInvalidCredentialsError();
    }

    if (user.locked_until && user.locked_until > new Date()) {
      throw this.createInvalidCredentialsError();
    }

    if (user.status !== 'active') {
      throw new ForbiddenException('аккаунт заблокирован');
    }

    const passwordMatches = await this.passwordService.verifyPassword(
      user.password_hash,
      dto.password,
    );

    if (!passwordMatches) {
      await this.registerFailedLogin(user.id, user.failed_login_count);
      throw this.createInvalidCredentialsError();
    }

    await this.prisma.users.update({
      where: {
        id: user.id,
      },
      data: {
        failed_login_count: 0,
        locked_until: null,
        last_login_at: new Date(),
        updated_at: new Date(),
      },
    });

    const session = await this.sessionService.createSession(user.id, request);
    const profile = await this.getMe(user.id);

    return {
      user: profile,
      session,
    };
  }

  /** отзывает текущую сессию */
  async logout(sessionId: string): Promise<void> {
    await this.sessionService.revokeSession(sessionId);
  }

  /** подтверждает почту пользователя */
  async verifyEmail(token: string): Promise<void> {
    await this.emailVerificationService.verifyEmail(token);
  }

  /** возвращает безопасные данные пользователя для frontend */
  async getMe(userId: string): Promise<AuthUserResponse> {
    const user = await this.prisma.users.findFirst({
      where: {
        id: userId,
        archived_at: null,
      },
      select: {
        id: true,
        email: true,
        display_name: true,
        status: true,
        email_verified_at: true,
        last_login_at: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('сессия недействительна');
    }

    const memberships = await this.prisma.organization_members.findMany({
      where: {
        user_id: user.id,
        archived_at: null,
        status: 'active',
      },
      include: {
        organizations: true,
        roles: true,
      },
      orderBy: {
        joined_at: 'asc',
      },
    });

    return {
      id: user.id,
      email: user.email,
      displayName: user.display_name,
      status: user.status,
      emailVerifiedAt: user.email_verified_at,
      lastLoginAt: user.last_login_at,
      organizations: memberships.map((membership) => ({
        id: membership.organizations.id,
        name: membership.organizations.name,
        slug: membership.organizations.slug,
        roleKey: membership.roles.key,
        roleName: membership.roles.name,
      })),
    };
  }

  /** нормализует почту перед поиском и записью */
  private normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
  }

  /** фиксирует неудачную попытку входа */
  private async registerFailedLogin(
    userId: string,
    failedLoginCount: number,
  ): Promise<void> {
    const nextFailedLoginCount = failedLoginCount + 1;
    const lockedUntil =
      nextFailedLoginCount >= AUTH_LOGIN_LOCK_LIMIT
        ? new Date(Date.now() + AUTH_LOCK_MINUTES * 60 * 1000)
        : null;

    await this.prisma.users.update({
      where: {
        id: userId,
      },
      data: {
        failed_login_count: nextFailedLoginCount,
        locked_until: lockedUntil,
        updated_at: new Date(),
      },
    });
  }

  /** создает одинаковую ошибку для неверной почты и пароля */
  private createInvalidCredentialsError(): UnauthorizedException {
    return new UnauthorizedException('неверная почта или пароль');
  }

  /** разрешает dev-токен подтверждения почты только вне production */
  private shouldExposeDevEmailToken(): boolean {
    return this.configService.get<string>('NODE_ENV') !== 'production';
  }
}
