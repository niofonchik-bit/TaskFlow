import { createHmac, randomBytes } from 'node:crypto';

/** создает криптографически стойкий одноразовый токен */
export function createSecureToken(): string {
  return randomBytes(32).toString('base64url');
}

/** хеширует токен перед сохранением в базе */
export function hashToken(
  token: string,
  secret: string,
): Uint8Array<ArrayBuffer> {
  const digest = createHmac('sha256', secret).update(token).digest();

  return Uint8Array.from(digest);
}
