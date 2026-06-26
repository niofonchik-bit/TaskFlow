import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { EmailVerificationService } from './email-verification.service';
import { AuthGuard } from './guards/auth.guard';
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
  ],
  exports: [AuthGuard, SessionService],
})
export class AuthModule {}
