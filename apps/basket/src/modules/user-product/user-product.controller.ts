import { Controller, ParseIntPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { Product } from '../product/entities';
import { UsersProductsService } from './user-product.service';

@Controller()
export class UsersProductsController {
  constructor(private readonly userProductService: UsersProductsService) {}

  @MessagePattern('SEND_PRODUCT_TO_BASKET_PG')
  async saveProductToBasket(
    @Payload('userId', ParseIntPipe) userId: number,
    @Payload('product') product: Product,
    @Payload('amount') productAmount: number,
  ): Promise<void> {
    await this.userProductService.saveProductToBasket(
      product,
      userId,
      productAmount,
    );
  }

  @MessagePattern('UPDATE_PRODUCT_IN_BASKET_PG')
  async updateProductsInBasket(
    @Payload('product') product: Product,
  ): Promise<void> {
    await this.userProductService.updateProductsInBasket(product);
  }
}
