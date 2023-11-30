import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request } from 'express';

import { WinstonLoggerService } from '../module';

function makeMiddlewareMessage(req: Request): string {
  const user = req.user ? `[USER]: ${JSON.stringify(req.user)}` : '';
  const method = `[METHOD]: ${req.method}`;
  const url = `[URL]: ${req.baseUrl}`;
  const headers = `[HEADERS]: ${JSON.stringify(req.headers)}`;
  const query = `[QUERY]: ${JSON.stringify(req.body.query)}`;

  const logMessage = [user, method, url, headers, query]
    .filter(Boolean)
    .join('\n');

  return logMessage;
}

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private readonly logger: WinstonLoggerService) {}
  use(req: any, res: any, next: (error?: any) => void) {
    this.logger.log(makeMiddlewareMessage(req));
    next();
  }
}
