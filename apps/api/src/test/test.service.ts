import { Injectable } from '@nestjs/common';
import type { TestRecord } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';

/** получает тестовую запись из PostgreSQL */
@Injectable()
export class TestService {
  /** сохраняет доступ к Prisma */
  constructor(private readonly prisma: PrismaService) {}

  /** получает запись с сортировкой по идентификатору */
  getList(): Promise<TestRecord[]> {
    return this.prisma.testRecord.findMany({
      orderBy: {
        id: 'asc',
      },
    });
  }
}
