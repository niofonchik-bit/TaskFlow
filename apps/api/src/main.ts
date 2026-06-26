import { json } from 'express';
import helmet from 'helmet';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { createOriginGuard } from './security/origin.middleware';

/** запускает HTTP-приложение */
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const allowedOrigin = process.env.AUTH_ALLOWED_ORIGIN;

  app.set('trust proxy', 1);
  app.use(helmet());
  app.use(json({ limit: '1mb' }));
  app.use(createOriginGuard(allowedOrigin));

  app.use(helmet());
  app.use(json({ limit: '1mb' }));
  app.use(createOriginGuard(allowedOrigin));

  app.enableCors({
    origin: allowedOrigin,
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  app.enableShutdownHooks();

  const port = Number(process.env.PORT ?? 3001);

  await app.listen(port, '0.0.0.0');

  console.log(`API started on port ${port}`);
}

void bootstrap().catch((error: unknown) => {
  console.error('API startup failed:', error);
  process.exit(1);
});
