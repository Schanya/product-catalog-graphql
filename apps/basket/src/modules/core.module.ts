import { Module } from '@nestjs/common';

import { BasketModule } from './basket/basket.module';
import { ProductModule } from './product/product.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [ProductModule, UserModule],
})
export class CoreModule {}
