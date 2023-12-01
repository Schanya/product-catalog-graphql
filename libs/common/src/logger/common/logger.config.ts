import { createLogger, format, transports, LoggerOptions } from 'winston';

import * as winstonMongoDB from 'winston-mongodb';
import { customFormat } from './logger.format';

function getLoggerOption(nodeEnv: string) {
  if (nodeEnv.trim() == 'docker') {
    const devLoggerOptions = {
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
    return devLoggerOptions;
  }
  const dockerLoggerOptions: LoggerOptions = {
    format: format.combine(
      format.timestamp(),
      format.errors({ stack: true }),
      customFormat,
    ),
    transports: [
      new winstonMongoDB.MongoDB({
        level: 'info',
        db: 'mongodb://mongodb:27017/winston',
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
  return dockerLoggerOptions;
}

const loggerOptions = getLoggerOption(process.env.NODE_ENV);

export const logger = createLogger(loggerOptions);
