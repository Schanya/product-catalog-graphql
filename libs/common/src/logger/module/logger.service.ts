import { Injectable, LoggerService } from '@nestjs/common';
import winston from 'winston';

import { logger } from '../common/logger.config';

@Injectable()
export class WinstonLoggerService implements LoggerService {
  private winstonLoggerr: winston.Logger;
  constructor() {
    this.winstonLoggerr = logger;
  }

  log(message: string) {
    this.winstonLoggerr.info(message);
  }

  error(message: string) {
    this.winstonLoggerr.error(message);
  }

  warn(message: string) {
    this.winstonLoggerr.warn(message);
  }

  debug(message: string) {
    this.winstonLoggerr.debug(message);
  }

  verbose(message: string) {
    this.winstonLoggerr.verbose(message);
  }
}
