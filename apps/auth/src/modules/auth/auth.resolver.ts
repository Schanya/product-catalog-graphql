import { Res, UseGuards, UseInterceptors } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Response } from 'express';
import { EntityManager } from 'typeorm';

import {
  TransactionInterceptor,
  TransactionParam,
  UserParam,
} from '@libs/common';

import { User } from '../users/entities';
import { AuthService } from './auth.service';

import { SignInInput, SignUpInput } from './dto';
import { LocalAuthGuard } from './guards';
import { JwtResponse } from './responses';
import { setCookie } from './utils';

@Resolver(() => JwtResponse)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @UseInterceptors(TransactionInterceptor)
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

  @UseInterceptors(TransactionInterceptor)
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
}
