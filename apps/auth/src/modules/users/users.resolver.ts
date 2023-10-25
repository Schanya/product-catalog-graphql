import { Resolver, Query, Args, ResolveReference } from '@nestjs/graphql';
import { ParseIntPipe } from '@nestjs/common';

import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { FindUserInput } from './dto';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly userService: UsersService) {}

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
