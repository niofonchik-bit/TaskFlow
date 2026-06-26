import { Module } from '@nestjs/common';
import { StorageService } from './storage.service';

/** предоставление доступа к файлому хранилищу */
@Module({
  providers: [StorageService],
  exports: [StorageService],
})
export class StorageModule {}
