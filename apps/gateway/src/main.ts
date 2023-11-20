import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { GatewayModule } from './gateway.module';

import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';
import * as passport from 'passport';

async function bootstrap() {
  const app = await NestFactory.create(GatewayModule);

  const config = app.get(ConfigService);

  app.use(cookieParser());

  app.use(
    session({
      secret: 'keyboard',
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 3.6e6,
      },
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());

  // app.enableCors({
  //   origin: true,
  //   credentials: true,
  // });

  await app.listen(config.get<number>('PORT'));
}
bootstrap();
