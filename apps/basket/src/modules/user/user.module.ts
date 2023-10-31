import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { JwtStrategy } from '@libs/common';

import { User, UsersProducts } from './entities';

import { UserResolver } from './user.resolver';
import { UsersProductsResolver } from './user-product.resolver';

import { UserService } from './user.service';
import { UsersProductsService } from './user-product.service';

import { ProductModule } from '../product/product.module';

@Module({
  imports: [TypeOrmModule.forFeature([User, UsersProducts]), ProductModule],
  providers: [
    UserResolver,
    UsersProductsResolver,
    UserService,
    UsersProductsService,
    JwtStrategy,
  ],
})
export class UserModule {}
