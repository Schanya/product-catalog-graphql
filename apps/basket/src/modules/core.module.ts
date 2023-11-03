import { Module } from '@nestjs/common';

import { BasketModule } from './basket/basket.module';
import { ProductModule } from './product/product.module';
import { UserModule } from './user/user.module';
import { UserProductModule } from './user-product/user-product.module';

@Module({
  imports: [BasketModule, ProductModule, UserModule, UserProductModule],
})
export class CoreModule {}
