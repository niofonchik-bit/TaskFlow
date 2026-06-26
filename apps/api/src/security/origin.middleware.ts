import type { NextFunction, Request, Response } from 'express';

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

/** создает защиту unsafe-запросов от чужого origin */
export function createOriginGuard(allowedOrigin?: string) {
  /** проверяет origin для запросов, которые могут менять данные */
  return function validateUnsafeRequestOrigin(
    request: Request,
    response: Response,
    next: NextFunction,
  ): void {
    if (SAFE_METHODS.has(request.method)) {
      next();
      return;
    }

    const origin = request.headers.origin;

    if (!allowedOrigin || origin === allowedOrigin) {
      next();
      return;
    }

    response.status(403).json({
      message: 'запрос из недоверенного источника отклонен',
    });
  };
}
