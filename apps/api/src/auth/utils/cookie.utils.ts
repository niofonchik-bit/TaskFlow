import type { CookieOptions, Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import {
  AUTH_SESSION_COOKIE_DEFAULT,
  AUTH_SESSION_TTL_DAYS_DEFAULT,
} from '../constants/auth.constants';

/** получает имя session-cookie из конфигурации */
export function getSessionCookieName(configService: ConfigService): string {
  return (
    configService.get<string>('AUTH_SESSION_COOKIE_NAME') ??
    AUTH_SESSION_COOKIE_DEFAULT
  );
}

/** получает срок жизни session-cookie в миллисекундах */
export function getSessionTtlMs(configService: ConfigService): number {
  const ttlDays = Number(
    configService.get<string>('AUTH_SESSION_TTL_DAYS') ??
      AUTH_SESSION_TTL_DAYS_DEFAULT,
  );

  return ttlDays * 24 * 60 * 60 * 1000;
}

/** создает безопасные настройки cookie сессии */
export function createSessionCookieOptions(
  configService: ConfigService,
): CookieOptions {
  const secure = configService.get<string>('AUTH_COOKIE_SECURE') === 'true';

  return {
    httpOnly: true,
    secure,
    sameSite: 'lax',
    path: '/',
    maxAge: getSessionTtlMs(configService),
  };
}

/** читает cookie из заголовка без дополнительного middleware */
export function readCookie(
  request: Request,
  cookieName: string,
): string | null {
  const cookieHeader = request.headers.cookie;

  if (!cookieHeader) {
    return null;
  }

  const cookie = cookieHeader
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${cookieName}=`));

  if (!cookie) {
    return null;
  }

  return decodeURIComponent(cookie.slice(cookieName.length + 1));
}

/** устанавливает session-cookie с raw token */
export function setSessionCookie(
  response: Response,
  configService: ConfigService,
  token: string,
): void {
  response.cookie(
    getSessionCookieName(configService),
    token,
    createSessionCookieOptions(configService),
  );
}

/** удаляет session-cookie в браузере */
export function clearSessionCookie(
  response: Response,
  configService: ConfigService,
): void {
  response.clearCookie(getSessionCookieName(configService), {
    path: '/',
  });
}
