import type { Request, Response } from 'express';
import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { AuthGuard } from './guards/auth.guard';
import type { AuthenticatedUser } from './types/authenticated-request';
import { clearSessionCookie, setSessionCookie } from './utils/cookie.utils';

/** предоставляет endpoints регистрации и авторизации */
@Controller('JS/auth')
export class AuthController {
  /** создает auth-controller */
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  /** регистрирует аккаунт и устанавливает session-cookie */
  @Post('register')
  @Throttle({ default: { ttl: 60_000, limit: 5 } })
  async register(
    @Body() dto: RegisterDto,
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.authService.register(dto, request);

    setSessionCookie(response, this.configService, result.session.token);

    return {
      data: result.user,
      devEmailVerificationToken: result.devEmailVerificationToken,
    };
  }

  /** авторизует пользователя и устанавливает session-cookie */
  @Post('login')
  @Throttle({ default: { ttl: 60_000, limit: 10 } })
  async login(
    @Body() dto: LoginDto,
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.authService.login(dto, request);

    setSessionCookie(response, this.configService, result.session.token);

    return {
      data: result.user,
    };
  }

  /** отзывает текущую сессию и очищает cookie */
  @Post('logout')
  @UseGuards(AuthGuard)
  async logout(
    @CurrentUser() user: AuthenticatedUser,
    @Res({ passthrough: true }) response: Response,
  ) {
    await this.authService.logout(user.sessionId);
    clearSessionCookie(response, this.configService);

    return {
      data: {
        success: true,
      },
    };
  }

  /** возвращает текущего пользователя */
  @Get('me')
  @UseGuards(AuthGuard)
  async me(@CurrentUser() user: AuthenticatedUser) {
    return {
      data: await this.authService.getMe(user.id),
    };
  }

  /** подтверждает почту по одноразовому токену */
  @Post('email/verify')
  async verifyEmail(@Body() dto: VerifyEmailDto) {
    await this.authService.verifyEmail(dto.token);

    return {
      data: {
        success: true,
      },
    };
  }
}
