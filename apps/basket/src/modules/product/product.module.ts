import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Product } from './entities';
import { ProductResolver } from './product.resolver';
import { ProductsService } from './product.service';
import { KafkaModule } from '@libs/common';

const DefinitionKafkaModule = KafkaModule.register({
  name: 'CATALOG',
});

@Module({
  imports: [TypeOrmModule.forFeature([Product]), DefinitionKafkaModule],
  providers: [ProductResolver, ProductsService],
  exports: [ProductsService],
})
export class ProductModule {}
