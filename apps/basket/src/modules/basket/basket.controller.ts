import { BasketMessage } from '@libs/common';
import { Controller, ParseIntPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { BasketService } from './basket.service';
import { Product } from './mongo-schemas';

@Controller()
export class BasketController {
  constructor(private readonly basketService: BasketService) {}

  @MessagePattern(BasketMessage.SEND_MONGO)
  async saveProductToBasket(
    @Payload('userId', ParseIntPipe) userId: number,
    @Payload('product') product: Product,
    @Payload('amount') productAmount: number,
  ): Promise<void> {
    await this.basketService.addProductToBasket(product, userId, productAmount);
  }

  @MessagePattern(BasketMessage.UPDATE_MONGO)
  async updateProductsInBasket(
    @Payload('product') product: Product,
    @Payload('users') users: any,
  ): Promise<void> {
    await this.basketService.updateProductsInBasket(product, users);
  }

  @MessagePattern(BasketMessage.DELETE_MONGO)
  async deleteProductsInBasket(
    @Payload('productIds') productIds: number[],
    @Payload('userId') userId: number,
  ): Promise<void> {
    await this.basketService.delete(userId, productIds);
  }

  @MessagePattern(BasketMessage.REDUCE_MONGO)
  async reduceProductsInBasket(
    @Payload('products') products: Product[],
  ): Promise<void> {
    await this.basketService.reduceAmountOfPurchasedProduct(products);
  }
}
