import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/** кодирование имени файла для заголовка скачивания */
function encodeFileName(fileName: string): string {
  return encodeURIComponent(fileName).replace(
    /['()*]/g,
    (character) => `%${character.charCodeAt(0).toString(16).toUpperCase()}`,
  );
}

/** управление файлами Railway Bucket */
@Injectable()
export class StorageService {
  private readonly client: S3Client;
  private readonly bucket: string;

  /** создание S3-клиента */
  constructor(configService: ConfigService) {
    this.bucket = configService.getOrThrow<string>('STORAGE_BUCKET');

    this.client = new S3Client({
      endpoint: configService.getOrThrow<string>('STORAGE_ENDPOINT'),
      region: configService.getOrThrow<string>('STORAGE_REGION'),
      credentials: {
        accessKeyId: configService.getOrThrow<string>('STORAGE_ACCESS_KEY_ID'),
        secretAccessKey: configService.getOrThrow<string>(
          'STORAGE_SECRET_ACCESS_KEY',
        ),
      },
    });
  }

  /** сохранение файла */
  async upload(key: string, file: Express.Multer.File): Promise<void> {
    await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
        ContentLength: file.size,
      }),
    );
  }

  /** удаление файла */
  async delete(key: string): Promise<void> {
    await this.client.send(
      new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: key,
      }),
    );
  }

  /** создание ссылки для предпросмотра */
  createPreviewUrl(key: string, mimeType: string): Promise<string> {
    return getSignedUrl(
      this.client,
      new GetObjectCommand({
        Bucket: this.bucket,
        Key: key,
        ResponseContentType: mimeType,
      }),
      {
        expiresIn: 300,
      },
    );
  }

  /** создание ссылки для скачивания */
  createDownloadUrl(
    key: string,
    fileName: string,
    mimeType: string,
  ): Promise<string> {
    return getSignedUrl(
      this.client,
      new GetObjectCommand({
        Bucket: this.bucket,
        Key: key,
        ResponseContentType: mimeType,
        ResponseContentDisposition: `attachment; filename*=UTF-8''${encodeFileName(fileName)}`,
      }),
      {
        expiresIn: 300,
      },
    );
  }
}
