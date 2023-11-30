import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { WinstonLoggerService } from './logger.service';

@Module({
  imports: [ConfigModule],
  providers: [WinstonLoggerService],
  exports: [WinstonLoggerService],
})
export class WinstonLoggerModule {}
