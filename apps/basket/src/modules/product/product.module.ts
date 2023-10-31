import { Inject, Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientKafka } from '@nestjs/microservices';

import { KafkaModule } from '@libs/common';

import { Product } from './entities';
import { ProductResolver } from './product.resolver';
import { ProductsService } from './product.service';

const DefinitionKafkaModule = KafkaModule.register({
  name: 'CATALOG',
});

@Module({
  imports: [TypeOrmModule.forFeature([Product]), DefinitionKafkaModule],
  providers: [ProductResolver, ProductsService],
  exports: [ProductsService],
})
export class ProductModule implements OnModuleInit {
  constructor(@Inject('CATALOG') private readonly catalogClient: ClientKafka) {}

  onModuleInit() {
    this.catalogClient.subscribeToResponseOf('GET_BY_ID');
  }
}
