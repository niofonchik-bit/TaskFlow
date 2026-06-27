import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { EmailVerifiedGuard } from '../guards/email-verified.guard';

/** требует действующую сессию и подтвержденную почту */
export function VerifiedSession() {
  return applyDecorators(UseGuards(AuthGuard, EmailVerifiedGuard));
}
