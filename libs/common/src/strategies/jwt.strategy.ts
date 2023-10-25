import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';

import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { JwtPayloadInput } from '../dto/jwt-payload.input';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.headers.authorization;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get('ACCESS_TOKEN_SECRET'),
    });
  }

  async validate(payload: JwtPayloadInput): Promise<JwtPayloadInput> {
    return payload;
  }
}
