import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';

import { UserParam } from '@libs/common';

import { User } from '../users/entities';
import { AuthService } from './auth.service';

import { SignInInput, SignUpInput } from './dto';
import { LocalAuthGuard } from './guards';
import { JwtResponse } from './responses';

@Resolver(() => JwtResponse)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => JwtResponse)
  async signUp(@Args('input') input: SignUpInput): Promise<JwtResponse> {
    const secretData = await this.authService.signUp(input);

    return secretData;
  }

  @UseGuards(LocalAuthGuard)
  @Mutation(() => JwtResponse)
  async signIn(
    @Args('input') input: SignInInput,
    @UserParam() user: User,
  ): Promise<JwtResponse> {
    const secretData = await this.authService.signIn(user);

    return secretData;
  }
}
