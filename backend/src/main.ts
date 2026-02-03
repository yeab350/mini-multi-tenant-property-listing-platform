import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = app.get(ConfigService);

  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const origin = config.get<string>('CORS_ORIGIN', 'http://localhost:3000');
  app.enableCors({ origin, credentials: true });

  const port = Number(config.get<string>('PORT', '3001'));
  await app.listen(port);
}
void bootstrap();
