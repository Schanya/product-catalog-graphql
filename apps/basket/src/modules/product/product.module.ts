import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Product } from './entities';
import { ProductResolver } from './product.resolver';
import { ProductsService } from './product.service';
import { KafkaModule } from '@libs/common';

const DefinitionBasketKafkaModule = KafkaModule.register({
  name: 'BASKET',
});

@Module({
  imports: [TypeOrmModule.forFeature([Product]), DefinitionBasketKafkaModule],
  providers: [ProductResolver, ProductsService],
  exports: [ProductsService],
})
export class ProductModule {}
