import { IsString, Length } from 'class-validator';

export class VerifyEmailDto {
  /** одноразовый токен подтверждения почты */
  @IsString()
  @Length(32, 512)
  token!: string;
}
