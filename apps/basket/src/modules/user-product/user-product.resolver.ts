import {
  JwtAuthGuard,
  JwtPayloadInput,
  RedisService,
  Role,
  Roles,
  RolesGuard,
  UserParam,
} from '@libs/common';
import { UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { BasketService } from '../basket/basket.service';
import { BasketEntity } from '../basket/entities';
import { UsersProducts } from './entities';
import { UsersProductsService } from './user-product.service';
import { getBasketCacheKey } from '../../common';

@Roles(Role.ADMIN, Role.USER)
@UseGuards(RolesGuard)
@UseGuards(JwtAuthGuard)
@Resolver(() => UsersProducts)
export class UsersProductsResolver {
  constructor(
    private readonly basketService: BasketService,
    private readonly userProductService: UsersProductsService,
    private readonly cache: RedisService,
  ) {}

  @Query(() => BasketEntity, { name: 'getBasket', nullable: true })
  async findOne(@UserParam() user: JwtPayloadInput) {
    const basket = await this.basketService.readBasketByUserId(user.id);

    return basket;
  }

  @Mutation(() => Boolean, { name: 'deleteProductInBasket' })
  async removeProduct(
    @UserParam() user: JwtPayloadInput,
    @Args('productId', { type: () => [Int] }) productId: number[],
  ) {
    await this.cache.del(getBasketCacheKey(user.id));

    return await this.userProductService.deleteProductsForUser(
      user.id,
      productId,
    );
  }
}
