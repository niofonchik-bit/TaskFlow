import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsString,
  Length,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  /** почта становится логином аккаунта */
  @IsEmail()
  @MaxLength(254)
  @Transform(({ value }) => String(value).trim().toLowerCase())
  email!: string;

  /** пароль не должен быть коротким, потому что MFA пока нет */
  @IsString()
  @MinLength(6)
  @MaxLength(128)
  password!: string;

  /** отображаемое имя пользователя */
  @IsString()
  @Length(2, 80)
  @Transform(({ value }) => String(value).trim())
  displayName!: string;

  /** первая организация создается вместе с аккаунтом */
  @IsString()
  @Length(2, 120)
  @Transform(({ value }) => String(value).trim())
  organizationName!: string;
}
