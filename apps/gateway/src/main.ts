import { NestFactory } from '@nestjs/core';
import { GatewayModule } from './gateway.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(GatewayModule);

  const config = app.get(ConfigService);

  await app.listen(config.get<number>('PORT'));
}
bootstrap();
