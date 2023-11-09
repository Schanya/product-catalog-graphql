import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { KafkaModule } from '@libs/common';

import { ProductModule } from '../product/product.module';
import { UserModule } from '../user/user.module';
import { BasketModule } from '../basket/basket.module';

import { UsersProducts } from './entities';
import { UsersProductsController } from './user-product.controller';
import { UsersProductsResolver } from './user-product.resolver';
import { UsersProductsService } from './user-product.service';

const DefinitionBasketKafkaModule = KafkaModule.register({
  name: 'BASKET',
});

@Module({
  imports: [
    TypeOrmModule.forFeature([UsersProducts]),
    ProductModule,
    UserModule,
    BasketModule,
    DefinitionBasketKafkaModule,
  ],
  controllers: [UsersProductsController],
  providers: [UsersProductsResolver, UsersProductsService],
  exports: [UsersProductsService],
})
export class UserProductModule {}
