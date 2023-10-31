import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { JwtAuthGuard, JwtPayloadInput, UserParam } from '@libs/common';

import { PutProductInput } from './dto';
import { UsersProducts } from './entities';
import { UsersProductsService } from './user-product.service';
import { UseGuards } from '@nestjs/common';

@Resolver(() => UsersProducts)
export class UsersProductsResolver {
  constructor(private readonly userProductService: UsersProductsService) {}

  @UseGuards(JwtAuthGuard)
  @Mutation(() => UsersProducts)
  async putProduct(
    @Args('input') putProductInput: PutProductInput,
    @UserParam() payload: JwtPayloadInput,
  ): Promise<UsersProducts> {
    const userProduct = await this.userProductService.putProduct(
      putProductInput,
      payload,
    );

    return userProduct;
  }
}
