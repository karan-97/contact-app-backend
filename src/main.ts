import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { join } from 'path';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
  });
  // global prefix
  app.setGlobalPrefix('api/v1');

  // handle all user input validation globally
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  
  //enable cors
  app.enableCors();

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');
  
  await app.listen(process.env.PORT || 8000);
}
bootstrap();
