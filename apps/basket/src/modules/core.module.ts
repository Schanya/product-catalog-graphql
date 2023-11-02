import { Module } from '@nestjs/common';

import { BasketModule } from './basket/basket.module';
import { ProductModule } from './product/product.module';
import { UserModule } from './user/user.module';
import { UserProductModule } from './user-product/user-product.module';

@Module({
  imports: [ProductModule, UserModule, BasketModule, UserProductModule],
})
export class CoreModule {}
