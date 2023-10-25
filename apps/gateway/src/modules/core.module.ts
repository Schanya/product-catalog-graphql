import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { CatalogModule } from './catalog/catalog.module';

@Module({
  imports: [CatalogModule, AuthModule],
  controllers: [],
  providers: [],
})
export class CoreModule {}
