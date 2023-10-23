import { NestFactory } from '@nestjs/core';
import { CatalogModule } from './catalog.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { KafkaService } from '@libs/libs';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(CatalogModule);

  const rmqService = app.get<KafkaService>(KafkaService);
  const configService = app.get<ConfigService>(ConfigService);

  app.connectMicroservice(
    rmqService.getOptions(configService.get<string>('KAFKA_NAME')),
  );

  app.init();

  await app.startAllMicroservices();
}
bootstrap();
