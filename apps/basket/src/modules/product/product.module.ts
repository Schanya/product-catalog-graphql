import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Product } from './entities';
import { ProductResolver } from './product.resolver';
import { ProductsService } from './product.service';

@Module({
  imports: [TypeOrmModule.forFeature([Product])],
  providers: [ProductResolver, ProductsService],
  exports: [ProductsService],
})
export class ProductModule {}
