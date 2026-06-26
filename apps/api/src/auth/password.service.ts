import * as argon2 from 'argon2';
import { Injectable } from '@nestjs/common';

/** управляет безопасным хешированием паролей */
@Injectable()
export class PasswordService {
  /** создает Argon2id-хеш пароля */
  async hashPassword(password: string): Promise<string> {
    return argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: 19_456,
      timeCost: 2,
      parallelism: 1,
    });
  }

  /** проверяет пароль через безопасную функцию библиотеки */
  async verifyPassword(
    passwordHash: string,
    password: string,
  ): Promise<boolean> {
    try {
      return await argon2.verify(passwordHash, password);
    } catch {
      return false;
    }
  }
}
