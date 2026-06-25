import { Controller, Get } from '@nestjs/common';
import type { TestRecord } from '../generated/prisma/client';
import { TestService } from './test.service';

/** принимает HTTP-запрос тестовой выборки */
@Controller('JS/test')
export class TestController {
  /** сохраняет сервис получения тестовой записи */
  constructor(private readonly testService: TestService) {}

  /** возвращает список тестовых записей */
  @Get('list')
  async getList(): Promise<{ data: TestRecord[] }> {
    const data = await this.testService.getList();

    return { data };
  }
}
