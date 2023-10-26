import { NestFactory } from '@nestjs/core';
import { GatewayModule } from './gateway.module';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(GatewayModule);

  const config = app.get(ConfigService);

  app.use(cookieParser());

  await app.listen(config.get<number>('PORT'));
}
bootstrap();
