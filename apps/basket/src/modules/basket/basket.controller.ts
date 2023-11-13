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
  ): Promise<void> {
    await this.basketService.updateProductForEachUser(product);
  }

  @MessagePattern(BasketMessage.DELETE_MONGO)
  async deleteProductsInBasket(
    @Payload('productIds') productIds: number[],
    @Payload('userId') userId: number,
  ): Promise<void> {
    await this.basketService.deleteProductsFromBasket(userId, productIds);
  }

  @MessagePattern(BasketMessage.REDUCE_MONGO)
  async reduceProductsInBasket(
    @Payload('products') products: Product[],
  ): Promise<void> {
    await this.basketService.reduceAmountOfPurchasedProduct(products);
  }

  @MessagePattern(BasketMessage.DELETE_PODUCT_MONGO)
  async deleteProductInUsersBasket(
    @Payload('productId') productId: number,
  ): Promise<void> {
    await this.basketService.deleteProductIfDeletedInCatalog(productId);
  }
}
