import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { AuthenticatedRequest } from '../types/authenticated-request';

/** запрещает доступ пользователю с неподтвержденной почтой */
@Injectable()
export class EmailVerifiedGuard implements CanActivate {
  /** проверяет результат AuthGuard */
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();

    if (!request.user) {
      throw new UnauthorizedException('требуется авторизация');
    }

    if (!request.user.emailVerifiedAt) {
      throw new ForbiddenException({
        code: 'EMAIL_NOT_VERIFIED',
        message: 'подтвердите почту для продолжения работы',
      });
    }

    return true;
  }
}
