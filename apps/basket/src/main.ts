import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { KafkaService } from '@libs/common';

import * as cookieParser from 'cookie-parser';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const rmqService = app.get<KafkaService>(KafkaService);
  const configService = app.get<ConfigService>(ConfigService);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.use(cookieParser());

  app.connectMicroservice(
    rmqService.getOptions(configService.get<string>('KAFKA_NAME')),
  );

  await app.startAllMicroservices();

  await app.listen(configService.get<number>('PORT'));
}
bootstrap();
