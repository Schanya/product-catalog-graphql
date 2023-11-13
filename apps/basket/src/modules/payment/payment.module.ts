import { Module } from '@nestjs/common';

import { JwtStrategy, KafkaModule } from '@libs/common';

import { StripeModule } from '../stripe-payment/stripe.module';
import { UserProductModule } from '../user-product/user-product.module';
import { PaymentService } from './payment.service';
import { PaymentResolver } from './payment.resolver';
import { ProductModule } from '../product/product.module';

const DefinitionCatalogKafkaModule = KafkaModule.register({
  name: 'CATALOG',
});

@Module({
  imports: [
    StripeModule,
    UserProductModule,
    ProductModule,
    DefinitionCatalogKafkaModule,
  ],
  providers: [JwtStrategy, PaymentService, PaymentResolver],
})
export class PaymentModule {}
