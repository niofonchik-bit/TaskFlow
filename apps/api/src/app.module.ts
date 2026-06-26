import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthModule } from './health/health.module';
import { PrismaModule } from './prisma/prisma.module';

/** объединяет конфигурацию и функциональный модуль API */
@Module({
  imports: [
    // загружает локальное окружение без изменения production-кода
    ConfigModule.forRoot({
      envFilePath: ['.env.development', '.env'],
      isGlobal: true,
    }),
    PrismaModule,
    HealthModule,
  ],
})
export class AppModule {}
