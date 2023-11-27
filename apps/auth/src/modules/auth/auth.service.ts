import {
  BadRequestException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { compare, genSalt, hash } from 'bcrypt';

import { JwtService } from '../jwt/jwt.service';
import { User } from '../users/entities';
import { UsersService } from '../users/users.service';

import { JwtPayloadInput } from '@libs/common';
import { EntityManager } from 'typeorm';
import { SignUpInput } from './dto';
import { JwtResponse } from './responses';

@Injectable()
export class AuthService {
  constructor(
    private readonly userSerivce: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<User> {
    const existingUser = await this.userSerivce.readByEmail(email);

    if (existingUser && (await compare(password, existingUser.password))) {
      return existingUser;
    }

    throw new UnauthorizedException('Incorrect email or password');
  }

  async signUp(
    signUpInput: SignUpInput,
    transaction?: EntityManager,
  ): Promise<JwtResponse> {
    const user = await this.createLocalUser(signUpInput, transaction);

    const tokens = await this.signIn(user, transaction);

    return tokens;
  }

  async signIn(user: User, transaction?: EntityManager): Promise<JwtResponse> {
    const jwts = await this.generateJwts(user.id, user.role);

    await this.jwtService.saveJwt(user, jwts.refreshToken, transaction);

    return jwts;
  }

  async refreshTokens(
    user: JwtPayloadInput,
    refreshToken: string,
    transaction: EntityManager,
  ): Promise<JwtResponse> {
    const token = await this.jwtService.getJwt(user.id, refreshToken);

    if (!token) {
      await this.jwtService.deleteAllJwt(user.id, transaction);

      throw new UnauthorizedException({
        message: 'Unauthorized user',
        statusCode: HttpStatus.UNAUTHORIZED,
      });
    }

    if (token.expirationDate < new Date()) {
      await this.jwtService.deleteJwt(user.id, refreshToken, transaction);

      throw new UnauthorizedException({
        message: `Token expired`,
        statusCode: HttpStatus.UNAUTHORIZED,
      });
    }

    await this.jwtService.deleteJwt(user.id, refreshToken, transaction);

    const secretData = await this.generateJwts(user.id, user.role);
    await this.jwtService.saveJwt(user, secretData.refreshToken, transaction);

    return secretData;
  }

  async logout(
    user: JwtPayloadInput,
    refreshToken: string,
    transaction: EntityManager,
  ): Promise<void> {
    await this.jwtService.deleteJwt(user.id, refreshToken, transaction);
  }

  async createLocalUser(
    signUpInput: SignUpInput,
    transaction?: EntityManager,
  ): Promise<User> {
    const existiongUser = await this.userSerivce.readByEmail(signUpInput.email);

    if (existiongUser) {
      throw new BadRequestException('User with this email already exists');
    }

    const passwordSalt = await genSalt();
    const hashPassword = await hash(signUpInput.password, passwordSalt);
    const createUserinput = {
      ...signUpInput,
      password: hashPassword,
      passwordSalt,
    };

    const user = await this.userSerivce.create(createUserinput, transaction);

    return user;
  }

  private async generateJwts(
    userId: number,
    userRole: string,
  ): Promise<JwtResponse> {
    const payload = { id: userId, role: userRole };

    const accessToken = await this.jwtService.generateAccessJwt(payload);
    const refreshToken = await this.jwtService.generateRefreshJwt(payload);

    return { accessToken, refreshToken };
  }
}
