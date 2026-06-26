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
  /** создает Prisma Client с проверкой TLS-сертификата */
  constructor(configService: ConfigService) {
    const connectionString = configService.getOrThrow<string>('DATABASE_URL');
    const ca = configService
      .getOrThrow<string>('DATABASE_CA_CERT')
      .replace(/\\n/g, '\n');

    const adapter = new PrismaPg({
      connectionString,
      ssl: {
        ca,
        rejectUnauthorized: true,
        checkServerIdentity: () => undefined,
      },
    });

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
