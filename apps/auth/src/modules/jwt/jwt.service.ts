import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService as NestJwtService } from '@nestjs/jwt';

import { JwtPayloadInput, getRepositoryFromTransaction } from '@libs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { Token } from './entities';
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

  public async saveJwt(
    user: JwtPayloadInput,
    refreshToken: string,
    transaction?: EntityManager,
  ): Promise<Token> {
    const tokenRepository = transaction
      ? await getRepositoryFromTransaction(transaction, Token)
      : this.tokenRepository;

    const existingTokenExpiration = this.config.get<string>(
      'REFRESH_TOKEN_EXPIRED',
    );

    const tokenExpiration = parseTokenExpiration(existingTokenExpiration);
    const expirationDate = new Date(new Date().getTime() + tokenExpiration);

    const tokenEntity = tokenRepository.create({
      refreshToken,
      expirationDate,
      user,
    });

    await tokenRepository.save(tokenEntity);

    return tokenEntity;
  }

  public async getJwt(userId: number, refreshToken: string): Promise<Token> {
    const token = await this.tokenRepository.findOne({
      where: {
        user: { id: userId },
        refreshToken,
      },
    });

    return token;
  }

  async deleteJwt(
    userId: number,
    refreshToken: string,
    transaction?: EntityManager,
  ): Promise<boolean> {
    const tokenRepository = transaction
      ? await getRepositoryFromTransaction(transaction, Token)
      : this.tokenRepository;

    const data = await tokenRepository.delete({
      user: { id: userId },
      refreshToken,
    });

    return data && data.affected > 0;
  }

  async deleteAllJwt(
    userId: number,
    transaction?: EntityManager,
  ): Promise<number> {
    const tokenRepository = transaction
      ? await getRepositoryFromTransaction(transaction, Token)
      : this.tokenRepository;

    const data = await tokenRepository.delete({
      user: { id: userId },
    });

    return data.affected;
  }
}
