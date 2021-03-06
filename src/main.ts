import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { ValidationPipe } from '@nestjs/common';
import { useContainer } from 'class-validator';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  app.useGlobalPipes(new ValidationPipe());
  app.useStaticAssets(join(__dirname, '..', 'client'), {
    setHeaders: (res, path) => {
      if (path.endsWith('stellar.toml')) {
        res.setHeader('Content-Type', 'text/plain');
      }
      res.set('Access-Control-Allow-Origin', '*');
    },
  });
  app.setViewEngine('html');

  const config = new DocumentBuilder()
    .setTitle('Stellar SEP-0010 Server')
    .setDescription(
      'This is the API documentation for the SEP-0010 Server implementation',
    )
    .addBearerAuth()
    .setVersion('0.1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
