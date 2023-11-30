import { Inject, Injectable } from '@nestjs/common';

import { ClientKafka } from '@nestjs/microservices';

import { StripeService } from '../stripe-payment/stripe.service';
import { CreatePurchaseInput } from './dto';
import { UsersProductsService } from '../user-product/user-product.service';
import { CatalogMessage, EmitEvent, OrderMessage } from '@libs/common';
import { ProductsService } from '../product/product.service';

@Injectable()
export class PaymentService {
  constructor(
    @Inject('CATALOG') private readonly catalogClient: ClientKafka,
    @Inject('ORDER') private readonly orderClient: ClientKafka,
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
      let products = await this.productService.readByIds(
        createPurchaseInput.productIds,
      );

      const order = await this.userProductService.readByUserIdAndProductIds(
        userId,
        createPurchaseInput.productIds,
      );

      await this.userProductService.deleteProductsForUser(
        userId,
        createPurchaseInput.productIds,
      );

      await this._emitCatalogEvent(CatalogMessage.PURCHASED_PRODUCT, {
        products,
      });

      const promises = products.map((product) =>
        this.userProductService.updateProductsAmountForEachUser(product),
      );

      await Promise.all(promises);

      products = products.map(
        (product) => (
          (product.quantity = order.find(
            (userProduct) => userProduct.productId == product.id,
          ).amount),
          product
        ),
      );

      await this._emitOrderEvent(OrderMessage.ADD_ORDER, { products, userId });
    }

    return url;
  }

  private async _emitCatalogEvent<T>(pattern: string, data: any): Promise<T> {
    const res = await EmitEvent<T>({
      client: this.catalogClient,
      pattern,
      data,
    });

    return res;
  }

  private async _emitOrderEvent<T>(pattern: string, data: any): Promise<T> {
    const res = await EmitEvent<T>({
      client: this.orderClient,
      pattern,
      data,
    });

    return res;
  }
}
