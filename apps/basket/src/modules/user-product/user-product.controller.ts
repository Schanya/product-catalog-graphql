import { Controller, ParseIntPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { Product } from '../product/entities';
import { UsersProductsService } from './user-product.service';
import { BasketMessage, RedisService } from '@libs/common';
import { getBasketCacheKey } from '../../common';

@Controller()
export class UsersProductsController {
  constructor(
    private readonly userProductService: UsersProductsService,
    private readonly cache: RedisService,
  ) {}

  @MessagePattern(BasketMessage.SEND_PG)
  async saveProductToBasket(
    @Payload('userId', ParseIntPipe) userId: number,
    @Payload('product') product: Product,
    @Payload('amount') productAmount: number,
  ): Promise<void> {
    await this.cache.del(getBasketCacheKey(userId));

    await this.userProductService.saveProductToBasket(
      product,
      userId,
      productAmount,
    );
  }

  @MessagePattern(BasketMessage.UPDATE_PG)
  async updateProductsInBasket(
    @Payload('product') product: Product,
  ): Promise<void> {
    await this.cache.del(getBasketCacheKey());

    await this.userProductService.updateProductsInBasket(product);
  }

  @MessagePattern(BasketMessage.DELETE_PODUCT_PG)
  async deleteProductInUsersBasket(
    @Payload('productId') productId: number,
  ): Promise<void> {
    await this.cache.del(getBasketCacheKey());

    await this.userProductService.deleteProductIfDeletedInCatalog(productId);
  }
}
