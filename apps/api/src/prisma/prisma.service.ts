import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client';

/** управляет подключением Prisma к PostgreSQL */
@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  /** создает Prisma Client с PostgreSQL-адаптером */
  constructor(configService: ConfigService) {
    const connectionString = configService.getOrThrow<string>('DATABASE_URL');
    const adapter = new PrismaPg({ connectionString });

    super({ adapter });
  }

  /** открывает соединение при запуске модуля */
  async onModuleInit(): Promise<void> {
    await this.$connect();
  }

  /** закрывает соединение при завершении приложения */
  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }
}
