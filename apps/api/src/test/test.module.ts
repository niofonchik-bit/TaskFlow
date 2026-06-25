import { Module } from '@nestjs/common';
import { TestController } from './test.controller';
import { TestService } from './test.service';

/** регистрирует тестовый маршрут и слой данных */
@Module({
  controllers: [TestController],
  providers: [TestService],
})
export class TestModule {}
