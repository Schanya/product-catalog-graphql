import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService as NestJwtService } from '@nestjs/jwt';

import { JwtPayloadInput } from '@libs/common';
import { Token } from './entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { parseTokenExpiration } from './utils';

@Injectable()
export class JwtService {
  constructor(
    private readonly nestJwtService: NestJwtService,
    private readonly config: ConfigService,
    @InjectRepository(Token)
    private readonly tokenRepository: Repository<Token>,
    private readonly userService: UsersService,
  ) {}

  async generateAccessJwt(payload: JwtPayloadInput): Promise<string> {
    const accessToken = await this.nestJwtService.signAsync(payload, {
      secret: this.config.get('ACCESS_TOKEN_SECRET'),
      expiresIn: this.config.get('ACCESS_TOKEN_EXPIRED'),
    });

    return accessToken;
  }

  async generateRefreshJwt(payload: JwtPayloadInput): Promise<string> {
    const refreshToken = await this.nestJwtService.signAsync(payload, {
      secret: this.config.get('REFRESH_TOKEN_SECRET'),
      expiresIn: this.config.get('REFRESH_TOKEN_EXPIRED'),
    });

    return refreshToken;
  }

  public async saveJwt(userId: number, refreshToken: string): Promise<Token> {
    const user = await this.userService.readById(userId);

    const existingTokenExpiration = this.config.get<string>(
      'REFRESH_TOKEN_EXPIRED',
    );

    const tokenExpiration = parseTokenExpiration(existingTokenExpiration);
    const expirationDate = new Date(new Date().getTime() + tokenExpiration);

    const tokenEntity = this.tokenRepository.create({
      refreshToken,
      expirationDate,
      user,
    });

    await this.tokenRepository.save(tokenEntity);

    user.tokens.push(tokenEntity);
    await user.save();

    return tokenEntity;
  }
}
