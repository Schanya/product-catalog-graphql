import { Resolver, Query, Args, ResolveReference } from '@nestjs/graphql';
import { ParseIntPipe, UseGuards } from '@nestjs/common';

import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { FindUserInput } from './dto';
import { AuthenticatedGuard } from '@libs/common';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly userService: UsersService) {}

  @UseGuards(AuthenticatedGuard)
  @Query(() => [User])
  async readAll(
    @Args('input', { nullable: true }) findUserInput: FindUserInput,
  ): Promise<User[]> {
    const users = await this.userService.readAll(findUserInput);

    return users;
  }

  @Query(() => User)
  async readById(@Args('id', ParseIntPipe) id: number): Promise<User> {
    const user = await this.userService.readById(id);
    return user;
  }

  @ResolveReference()
  async resolveReference(reference: {
    __typename: string;
    id: number;
  }): Promise<User> {
    return await this.userService.readById(reference.id);
  }
}
