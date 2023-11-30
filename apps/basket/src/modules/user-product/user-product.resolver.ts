import {
  JwtAuthGuard,
  JwtPayloadInput,
  RedisService,
  UserParam,
} from '@libs/common';
import { UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { BasketService } from '../basket/basket.service';
import { BasketEntity } from '../basket/entities';
import { UsersProducts } from './entities';
import { UsersProductsService } from './user-product.service';
import { getBasketCacheKey } from '../../common';

@UseGuards(JwtAuthGuard)
@Resolver(() => UsersProducts)
export class UsersProductsResolver {
  constructor(
    private readonly basketService: BasketService,
    private readonly userProductService: UsersProductsService,
    private readonly cache: RedisService,
  ) {}

  @Query(() => BasketEntity, { name: 'getBasket' })
  async findOne(@UserParam() user: JwtPayloadInput) {
    const key = getBasketCacheKey();

    const fromCache = await this.cache.get(key);
    if (fromCache) {
      return fromCache;
    }

    const basket = await this.basketService.readBasketByUserId(user.id);
    await this.cache.set(key, basket);

    return basket;
  }

  @Mutation(() => Boolean, { name: 'deleteProductInBasket' })
  async removeProduct(
    @UserParam() user: JwtPayloadInput,
    @Args('productId', { type: () => [Int] }) productId: number[],
  ) {
    await this.cache.del(getBasketCacheKey());

    return await this.userProductService.deleteProductsForUser(
      user.id,
      productId,
    );
  }
}
