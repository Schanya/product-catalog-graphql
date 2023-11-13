import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ProductsResolver } from './products.resolver';
import { ProductsService } from './products.service';
import { KafkaModule } from '@libs/common';

const DefinitionBasketKafkaModule = KafkaModule.register({
  name: 'BASKET',
});

@Module({
  imports: [TypeOrmModule.forFeature([Product]), DefinitionBasketKafkaModule],
  providers: [ProductsResolver, ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
