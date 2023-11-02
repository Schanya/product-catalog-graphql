import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProductModule } from '../product/product.module';
import { UserModule } from '../user/user.module';

import { UsersProducts } from './entities';
import { UsersProductsController } from './user-product.controller';
import { UsersProductsResolver } from './user-product.resolver';
import { UsersProductsService } from './user-product.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UsersProducts]),
    ProductModule,
    UserModule,
  ],
  controllers: [UsersProductsController],
  providers: [UsersProductsResolver, UsersProductsService],
})
export class UserProductModule {}
