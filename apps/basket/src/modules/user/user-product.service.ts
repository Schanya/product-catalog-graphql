import { Injectable, Scope } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { JwtPayloadInput } from '@libs/common';

import { Product } from '../product/entities';
import { ProductsService } from '../product/product.service';

import { UserService } from './user.service';

import {
  CreateUserProductInput,
  PutProductInput,
  UpdateUserProductInput,
} from './dto';
import { UsersProducts } from './entities';

@Injectable({ scope: Scope.REQUEST })
export class UsersProductsService {
  constructor(
    private readonly productService: ProductsService,
    private readonly userService: UserService,
    @InjectRepository(UsersProducts)
    private readonly usersProductsRepository: Repository<UsersProducts>,
  ) {}

  async putProduct(
    putProductInput: PutProductInput,
    payload: JwtPayloadInput,
  ): Promise<UsersProducts> {
    const product = await this.productService.createOrGet(putProductInput.id);
    const user = await this.userService.createOrGet(payload.id);

    const existedUserProduct = await this.usersProductsRepository.findOne({
      where: { userId: user.id, productId: product.id },
    });

    await this.checkTotalAmount(product, putProductInput.amount);

    const createdUserProduct = existedUserProduct
      ? await this.update(existedUserProduct, {
          amount: putProductInput.amount,
        })
      : await this.create({
          userId: user.id,
          productId: product.id,
          amount: putProductInput.amount,
        });

    return createdUserProduct;
  }

  private async create(
    createUserProductInput: CreateUserProductInput,
  ): Promise<UsersProducts> {
    const userProductEntity = this.usersProductsRepository.create(
      createUserProductInput,
    );

    const userProduct =
      await this.usersProductsRepository.save(userProductEntity);

    return userProduct;
  }

  private async update(
    userProduct: UsersProducts,
    updateUserProduct: UpdateUserProductInput,
  ): Promise<UsersProducts> {
    userProduct.amount = updateUserProduct.amount;

    await userProduct.save();

    return userProduct;
  }

  private async checkTotalAmount(
    product: Product,
    amount: number,
  ): Promise<void> {
    if (product.quantity < amount) {
      throw new RpcException(
        'Specified  quantity of the product is more than what is in the catalog',
      );
    }
  }
}
