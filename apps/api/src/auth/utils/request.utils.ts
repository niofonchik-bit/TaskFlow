import type { Request } from 'express';

/** получает ip-адрес запроса с учетом proxy */
export function getRequestIp(request: Request): string | null {
  const forwardedFor = request.headers['x-forwarded-for'];

  if (typeof forwardedFor === 'string') {
    return forwardedFor.split(',')[0]?.trim() || null;
  }

  if (Array.isArray(forwardedFor)) {
    return forwardedFor[0]?.split(',')[0]?.trim() || null;
  }

  return request.ip || request.socket.remoteAddress || null;
}

/** получает user-agent без доверия к нему как к защищенному признаку */
export function getUserAgent(request: Request): string | null {
  const userAgent = request.headers['user-agent'];

  return typeof userAgent === 'string' ? userAgent.slice(0, 512) : null;
}
