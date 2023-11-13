import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { CatalogMessage } from '@libs/common';

import { Product } from './products/entities';
import { ProductsService } from './products/products.service';

@Controller()
export class CatalogController {
  constructor(private readonly productService: ProductsService) {}

  @MessagePattern(CatalogMessage.PURCHASED_PRODUCT)
  async purchasedProduct(
    @Payload('products') products: Product[],
  ): Promise<void> {
    await this.productService.reduceAmountOfPurchasedProduct(products);
  }
}
