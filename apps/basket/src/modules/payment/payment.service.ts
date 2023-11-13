import { Inject, Injectable } from '@nestjs/common';

import { ClientKafka } from '@nestjs/microservices';

import { StripeService } from '../stripe-payment/stripe.service';
import { CreatePurchaseInput } from './dto';
import { UsersProductsService } from '../user-product/user-product.service';
import { CatalogMessage } from '@libs/common';
import { ProductsService } from '../product/product.service';

@Injectable()
export class PaymentService {
  constructor(
    @Inject('CATALOG') private readonly catalogClient: ClientKafka,
    private readonly stripeService: StripeService,
    private readonly userProductService: UsersProductsService,
    private readonly productService: ProductsService,
  ) {}

  async purchase(
    createPurchaseInput: CreatePurchaseInput,
    userId: number,
  ): Promise<any> {
    const productsInfo = await this.userProductService.reduceAmountOfProducts(
      createPurchaseInput,
      userId,
    );

    const url = await this.stripeService.createCheckoutSession({
      currency: 'usd',
      products: productsInfo,
    });

    if (url) {
      const products = await this.productService.readByIds(
        createPurchaseInput.productIds,
      );

      await this.userProductService.deleteProductsForUser(
        userId,
        createPurchaseInput.productIds,
      );

      await this.catalogClient
        .emit(CatalogMessage.PURCHASED_PRODUCT, { products })
        .toPromise();

      const promises = products.map((product) =>
        this.userProductService.updateProductsAmountForEachUser(product),
      );

      await Promise.all(promises);
    }

    return url;
  }
}
