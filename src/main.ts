import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  DocumentBuilder,
  SwaggerDocumentOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { FreezePipe } from './pipes/freeze.pipe';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
    // new FreezePipe(),
  );

  app.useGlobalFilters(new AllExceptionsFilter());
  app.use(cookieParser());

  const config = new DocumentBuilder()
    .setTitle('Example')
    .setDescription('Auth user example')
    .setVersion('1.0')
    .addCookieAuth('Authentication', {
      type: 'apiKey',
      in: 'cookie',
    })
    .addCookieAuth('Refresh', {
      type: 'apiKey',
      in: 'cookie',
    })
    .addBearerAuth()
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, documentFactory);
  const cors = require('cors');
  app.use(cors());
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
