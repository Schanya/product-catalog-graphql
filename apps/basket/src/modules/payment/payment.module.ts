import { Module } from '@nestjs/common';

import { JwtStrategy, KafkaModule } from '@libs/common';

import { ProductModule } from '../product/product.module';
import { StripeModule } from '../stripe-payment/stripe.module';
import { UserProductModule } from '../user-product/user-product.module';
import { PaymentResolver } from './payment.resolver';
import { PaymentService } from './payment.service';

const DefinitionCatalogKafkaModule = KafkaModule.register({
  name: 'CATALOG',
});

const DefinitionOrderKafkaModule = KafkaModule.register({
  name: 'ORDER',
});

@Module({
  imports: [
    StripeModule,
    UserProductModule,
    ProductModule,
    DefinitionCatalogKafkaModule,
    DefinitionOrderKafkaModule,
  ],
  providers: [JwtStrategy, PaymentService, PaymentResolver],
})
export class PaymentModule {}
