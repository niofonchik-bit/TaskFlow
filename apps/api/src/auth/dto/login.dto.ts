import { Transform } from 'class-transformer';
import { IsEmail, IsString, MaxLength } from 'class-validator';

export class LoginDto {
  /** почта используется как логин */
  @IsEmail()
  @MaxLength(254)
  @Transform(({ value }) => String(value).trim().toLowerCase())
  email!: string;

  /** пароль проверяется только через Argon2id-хеш */
  @IsString()
  @MaxLength(128)
  password!: string;
}
