import { BadRequestException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';

import { ConfigService } from '@nestjs/config';
import { JwtPayloadInput } from '@libs/common';

@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, 'refresh') {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          const data = request?.cookies['auth-cookie'];
          if (!data) {
            return null;
          }

          return data.refreshToken;
        },
      ]),
      ignoreExpiration: true,
      secretOrKey: configService.get<string>('REFRESH_TOKEN_SECRET'),
    });
  }

  async validate(payload: JwtPayloadInput) {
    if (!payload) {
      throw new BadRequestException('missing refresh jwt');
    }
    return payload;
  }
}
