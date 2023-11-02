import { Injectable, Scope } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Product } from '../product/entities';
import { ProductsService } from '../product/product.service';

import { UserService } from '../user/user.service';

import { CreateUserProductInput, UpdateUserProductInput } from './dto';
import { UsersProducts } from './entities';

@Injectable({ scope: Scope.REQUEST })
export class UsersProductsService {
  constructor(
    private readonly productService: ProductsService,
    private readonly userService: UserService,
    @InjectRepository(UsersProducts)
    private readonly usersProductsRepository: Repository<UsersProducts>,
  ) {}

  async saveProductToBasket(
    product: Product,
    userId: number,
    amount: number,
  ): Promise<void> {
    await this.productService.createIfNotExist(product);
    await this.userService.createIfNotExist(userId);

    const userProduct = await this.usersProductsRepository.findOne({
      where: { productId: product.id, userId },
    });

    userProduct
      ? await this.update(userProduct, { amount })
      : await this.create({
          userId,
          productId: product.id,
          amount,
        });
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
    const updatedUserProduct = Object.assign(userProduct, updateUserProduct);

    await updatedUserProduct.save();

    return updatedUserProduct;
  }
}
