import { Module } from '@nestjs/common';

import { BasketModule } from './basket/basket.module';
import { ProductModule } from './product/product.module';
import { UserModule } from './user/user.module';
import { UserProductModule } from './user-product/user-product.module';
import { PaymentModule } from './payment/payment.module';
import { StripeModule } from './stripe-payment/stripe.module';

@Module({
  imports: [
    BasketModule,
    ProductModule,
    UserModule,
    UserProductModule,
    PaymentModule,
    StripeModule,
  ],
})
export class CoreModule {}
