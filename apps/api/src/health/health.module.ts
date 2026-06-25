import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';

/** регистрирует маршрут проверки доступности */
@Module({
  controllers: [HealthController],
})
export class HealthModule {}
