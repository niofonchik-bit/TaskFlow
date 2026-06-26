import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { SessionService } from '../session.service';
import type { AuthenticatedRequest } from '../types/authenticated-request';

/** проверяет session-cookie и добавляет пользователя в request */
@Injectable()
export class AuthGuard implements CanActivate {
  /** создает guard авторизации */
  constructor(private readonly sessionService: SessionService) {}

  /** разрешает запрос только при валидной сессии */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const resolvedSession = await this.sessionService.resolveSession(request);

    if (!resolvedSession) {
      throw new UnauthorizedException('требуется авторизация');
    }

    request.user = resolvedSession.user;

    return true;
  }
}
