import { randomUUID } from 'node:crypto';
import { basename, extname } from 'node:path';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import type { TestRecord } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from '../storage/storage.service';

export interface TestRecordFileResponse {
  fileName: string;
  mimeType: string;
  size: number;
  previewUrl: string | null;
}

export interface TestRecordResponse {
  id: number;
  name: string;
  createdAt: Date;
  file: TestRecordFileResponse | null;
}

/** управляет тестовыми записями и их файлами */
@Injectable()
export class TestService {
  private readonly logger = new Logger(TestService.name);

  /** сохраняет зависимости */
  constructor(
    private readonly prisma: PrismaService,
    private readonly storage: StorageService,
  ) {}

  /** возвращает тестовые записи */
  async getList(): Promise<TestRecordResponse[]> {
    const records = await this.prisma.testRecord.findMany({
      orderBy: {
        id: 'asc',
      },
    });

    return Promise.all(records.map((record) => this.mapRecord(record)));
  }

  /** заменяет файл тестовой записи */
  async replaceFile(
    id: number,
    file: Express.Multer.File,
  ): Promise<TestRecordResponse> {
    const currentRecord = await this.prisma.testRecord.findUnique({
      where: {
        id,
      },
    });

    if (!currentRecord) {
      throw new NotFoundException('Тестовая запись не найдена');
    }

    const originalName = basename(file.originalname);
    const extension = extname(originalName)
      .toLowerCase()
      .replace(/[^a-z0-9.]/g, '')
      .slice(0, 16);

    const newFileKey = `test-records/${id}/${randomUUID()}${extension}`;

    await this.storage.upload(newFileKey, file);

    let updatedRecord: TestRecord;

    try {
      updatedRecord = await this.prisma.testRecord.update({
        where: {
          id,
        },
        data: {
          fileName: originalName,
          fileKey: newFileKey,
          fileMimeType: file.mimetype || 'application/octet-stream',
          fileSize: file.size,
          fileUpdatedAt: new Date(),
        },
      });
    } catch (error: unknown) {
      await this.storage.delete(newFileKey).catch(() => undefined);

      throw error;
    }

    if (currentRecord.fileKey) {
      await this.storage
        .delete(currentRecord.fileKey)
        .catch((error: unknown) => {
          this.logger.warn(
            `Не удалось удалить старый файл записи ${id}`,
            error,
          );
        });
    }

    return this.mapRecord(updatedRecord);
  }

  /** возвращает временную ссылку для скачивания */
  async getDownloadUrl(
    id: number,
  ): Promise<{ url: string; expiresIn: number }> {
    const record = await this.prisma.testRecord.findUnique({
      where: {
        id,
      },
    });

    if (
      !record ||
      !record.fileKey ||
      !record.fileName ||
      !record.fileMimeType
    ) {
      throw new NotFoundException('Файл записи не найден');
    }

    const url = await this.storage.createDownloadUrl(
      record.fileKey,
      record.fileName,
      record.fileMimeType,
    );

    return {
      url,
      expiresIn: 300,
    };
  }

  /** преобразует запись в ответ API */
  private async mapRecord(record: TestRecord): Promise<TestRecordResponse> {
    if (
      !record.fileKey ||
      !record.fileName ||
      !record.fileMimeType ||
      record.fileSize === null
    ) {
      return {
        id: record.id,
        name: record.name,
        createdAt: record.createdAt,
        file: null,
      };
    }

    const previewUrl = record.fileMimeType.startsWith('image/')
      ? await this.storage.createPreviewUrl(record.fileKey, record.fileMimeType)
      : null;

    return {
      id: record.id,
      name: record.name,
      createdAt: record.createdAt,
      file: {
        fileName: record.fileName,
        mimeType: record.fileMimeType,
        size: record.fileSize,
        previewUrl,
      },
    };
  }
}
