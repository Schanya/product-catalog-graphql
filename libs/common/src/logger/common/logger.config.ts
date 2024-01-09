import { LoggerOptions, createLogger, format } from 'winston';
import * as winstonMongoDB from 'winston-mongodb';
import { customFormat } from './logger.format';

const loggerOptions: LoggerOptions = {
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    customFormat,
  ),
  transports: [
    new winstonMongoDB.MongoDB({
      level: 'info',
      db: 'mongodb://127.0.0.1:27017/winston',
      options: {
        useUnifiedTopology: true,
      },
      collection: 'logs',
      format: format.combine(
        format.timestamp(),
        format.errors({ stack: true }),
        customFormat,
      ),
    }),
  ],
};

export const logger = createLogger(loggerOptions);
