import { ParseIntPipe, UseGuards } from '@nestjs/common';
import { Args, Query, ResolveReference, Resolver } from '@nestjs/graphql';

import { Role, Roles, SessionGuard } from '@libs/common';
import { RolesGuard } from '@libs/common/guards/role.guard';

import { FindUserInput } from './dto';
import { User } from './entities';
import { UsersService } from './users.service';

@Roles(Role.ADMIN)
@UseGuards(SessionGuard, RolesGuard)
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
