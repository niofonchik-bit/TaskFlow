import { Controller, Get } from '@nestjs/common';

/** предоставляет проверку доступности API */
@Controller('health')
export class HealthController {
  /** возвращает состояние API */
  @Get()
  getStatus(): { status: 'ok' } {
    return {
      status: 'ok',
    };
  }
}
