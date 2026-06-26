import { Module } from '@nestjs/common';
import { StorageModule } from '../storage/storage.module';
import { TestController } from './test.controller';
import { TestService } from './test.service';

/** регистрирует тестовые маршруты */
@Module({
  imports: [StorageModule],
  controllers: [TestController],
  providers: [TestService],
})
export class TestModule {}
