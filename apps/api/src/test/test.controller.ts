import {
  BadRequestException,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { TestRecordResponse, TestService } from './test.service';

const MAX_FILE_SIZE = 10 * 1024 * 1024;

/** принимает тестовые HTTP-запросы */
@Controller('JS/test')
export class TestController {
  /** сохраняет сервис тестовых записей */
  constructor(private readonly testService: TestService) {}

  /** возвращает список записей */
  @Get('list')
  async getList(): Promise<{ data: TestRecordResponse[] }> {
    const data = await this.testService.getList();

    return { data };
  }

  /** добавляет или заменяет файл записи */
  @Post(':id/file')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        files: 1,
        fileSize: MAX_FILE_SIZE,
      },
    }),
  )
  async replaceFile(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File | undefined,
  ): Promise<{ data: TestRecordResponse }> {
    if (!file) {
      throw new BadRequestException('Файл не передан');
    }

    const data = await this.testService.replaceFile(id, file);

    return { data };
  }

  /** возвращает ссылку на скачивание */
  @Get(':id/file/download')
  async getDownloadUrl(@Param('id', ParseIntPipe) id: number): Promise<{
    data: {
      url: string;
      expiresIn: number;
    };
  }> {
    const data = await this.testService.getDownloadUrl(id);

    return { data };
  }
}
