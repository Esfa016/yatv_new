import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet'
import * as sanitizer from 'express-mongo-sanitize'
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
 app.use(
   sanitizer({
     replaceWith: '_',
   }),
 );
   app.enableCors();
   app.use(helmet());
  app.setGlobalPrefix('/api');
  await app.listen(process.env.PORT);
}
bootstrap();
