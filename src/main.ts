import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.useStaticAssets(join(__dirname, '..', 'client'), {
    setHeaders: (res, path) => {
      // this covers  1. and 2. situation but NOT the 3. one
      if (path.endsWith('stellar.toml')) {
        res.setHeader('Content-Type', 'text/plain');
      }
    },
  });
  app.setViewEngine('html');

  const config = new DocumentBuilder()
    .setTitle('Stellar SEP-0010 Server')
    .setDescription(
      'This is the API documentation for the SEP-0010 Server implementation',
    )
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
