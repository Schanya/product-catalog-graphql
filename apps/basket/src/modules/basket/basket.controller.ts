import { Controller, ParseIntPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { BasketService } from './basket.service';
import { Product } from './mongo-schemas';
import { UpdateUserProductInput } from '../user-product/dto';

@Controller()
export class BasketController {
  constructor(private readonly basketService: BasketService) {}

  @MessagePattern('SEND_PRODUCT_TO_BASKET_MONGO')
  async saveProductToBasket(
    @Payload('userId', ParseIntPipe) userId: number,
    @Payload('product') product: Product,
    @Payload('amount') productAmount: number,
  ): Promise<void> {
    await this.basketService.addProductToBasket(product, userId, productAmount);
  }

  @MessagePattern('UPDATE_PRODUCT_IN_BASKET_MONGO')
  async updateProductsInBasket(
    @Payload('product') product: Product,
    @Payload('users') users: any,
  ): Promise<void> {
    await this.basketService.updateProductsInBasket(product, users);
  }

  @MessagePattern('DELETE_PRODUCT_IN_BASKET_MONGO')
  async deleteProductsInBasket(
    @Payload('productId') productId: number,
    @Payload('userId') userId: number,
  ): Promise<void> {
    await this.basketService.delete(userId, productId);
  }
}
