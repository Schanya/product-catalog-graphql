import { Res, UseGuards, UseInterceptors } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Response } from 'express';
import { EntityManager } from 'typeorm';

import {
  JwtPayloadInput,
  TransactionInterceptor,
  TransactionParam,
  UserParam,
} from '@libs/common';

import { User } from '../users/entities';
import { AuthService } from './auth.service';

import { SignInInput, SignUpInput } from './dto';
import { LocalAuthGuard, RefreshGuard } from './guards';
import { JwtResponse } from './responses';
import { sessionDestroy, setCookie } from './utils';
import { TokensFromRequest } from './decorators';

@UseInterceptors(TransactionInterceptor)
@Resolver(() => JwtResponse)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => JwtResponse)
  async signUp(
    @Args('input') input: SignUpInput,
    @TransactionParam() transaction: EntityManager,
    @Res({ passthrough: true }) res: Response,
  ): Promise<JwtResponse> {
    const secretData = await this.authService.signUp(input, transaction);

    setCookie(res, secretData);

    return secretData;
  }

  @UseGuards(LocalAuthGuard)
  @Mutation(() => JwtResponse)
  async signIn(
    @Args('input') input: SignInInput,
    @UserParam() user: User,
    @TransactionParam() transaction: EntityManager,
    @Res({ passthrough: true }) res: Response,
  ): Promise<JwtResponse> {
    const secretData = await this.authService.signIn(user, transaction);

    setCookie(res, secretData);

    return secretData;
  }

  @UseGuards(RefreshGuard)
  @Mutation(() => JwtResponse)
  async refreshTokens(
    @UserParam() user: JwtPayloadInput,
    @TokensFromRequest('refreshToken') oldRefreshToken: string,
    @TransactionParam() transaction: EntityManager,
    @Res({ passthrough: true }) res: Response,
  ): Promise<JwtResponse> {
    const secretData = await this.authService.refreshTokens(
      user,
      oldRefreshToken,
      transaction,
    );

    setCookie(res, secretData);

    return secretData;
  }

  @UseGuards(RefreshGuard)
  @Mutation(() => Boolean)
  async logout(
    @UserParam() user: JwtPayloadInput,
    @TokensFromRequest() refreshToken: string,
    @TransactionParam() transaction: EntityManager,
    @Res({ passthrough: true }) res: Response,
  ): Promise<boolean> {
    await this.authService.logout(user, refreshToken, transaction);

    setCookie(res, null);
    sessionDestroy(res);

    return true;
  }
}
