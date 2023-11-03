import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ProductsResolver } from './products.resolver';
import { ProductsService } from './products.service';
import { KafkaModule } from '@libs/common';

const DefinitionKafkaModule = KafkaModule.register({
  name: 'CATALOG',
});

@Module({
  imports: [TypeOrmModule.forFeature([Product]), DefinitionKafkaModule],
  providers: [ProductsResolver, ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
