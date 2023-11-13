import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { CatalogModule } from './catalog/catalog.module';
import { BasketModule } from './basket/basket.module';

@Module({
  imports: [CatalogModule, AuthModule, BasketModule],
  controllers: [],
  providers: [],
})
export class CoreModule {}
