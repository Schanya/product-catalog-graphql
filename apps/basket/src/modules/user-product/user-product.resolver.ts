import { JwtAuthGuard, JwtPayloadInput, UserParam } from '@libs/common';
import { UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { BasketService } from '../basket/basket.service';
import { Basket } from '../basket/entities';
import { UsersProducts } from './entities';
import { UsersProductsService } from './user-product.service';

@UseGuards(JwtAuthGuard)
@Resolver(() => UsersProducts)
export class UsersProductsResolver {
  constructor(
    private readonly basketService: BasketService,
    private readonly userProductService: UsersProductsService,
  ) {}

  @Query(() => Basket, { name: 'getBasket' })
  async findOne(@UserParam() user: JwtPayloadInput) {
    return await this.basketService.readByUserId(user.id);
  }

  @Mutation(() => Boolean, { name: 'deleteProductInBasket' })
  async removeProduct(
    @UserParam() user: JwtPayloadInput,
    @Args('productId', { type: () => Int }) productId: number,
  ) {
    return await this.userProductService.delete(user.id, productId);
  }
}
