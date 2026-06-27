import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { EmailVerificationService } from './email-verification.service';
import { AuthGuard } from './guards/auth.guard';
import { EmailVerifiedGuard } from './guards/email-verified.guard';
import { PasswordService } from './password.service';
import { SessionService } from './session.service';

/** объединяет регистрацию, вход и проверку сессии */
@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    PasswordService,
    SessionService,
    EmailVerificationService,
    AuthGuard,
    EmailVerifiedGuard,
  ],
  exports: [AuthGuard, EmailVerifiedGuard, SessionService],
})
export class AuthModule {}
