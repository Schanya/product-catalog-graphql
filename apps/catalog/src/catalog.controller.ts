import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { CatalogMessage, RedisService } from '@libs/common';

import { Product } from './products/entities';
import { ProductsService } from './products/products.service';
import { getProductCacheKey } from './common';

@Controller()
export class CatalogController {
  constructor(
    private readonly productService: ProductsService,
    private readonly cache: RedisService,
  ) {}

  @MessagePattern(CatalogMessage.PURCHASED_PRODUCT)
  async purchasedProduct(
    @Payload('products') products: Product[],
  ): Promise<void> {
    await this.cache.del(getProductCacheKey());
    const delCacheProductsPromise = products.map((product) =>
      this.cache.del(getProductCacheKey(product.id)),
    );

    await this.productService.reduceAmountOfPurchasedProduct(products);

    await Promise.all(delCacheProductsPromise);
  }
}
