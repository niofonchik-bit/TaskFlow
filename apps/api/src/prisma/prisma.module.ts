import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

/** предоставляет единое подключение Prisma всему API */
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
