import { Inject, Injectable, Scope } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Product } from '../product/entities';
import { ProductsService } from '../product/product.service';

import { UserService } from '../user/user.service';

import { ClientKafka, RpcException } from '@nestjs/microservices';
import { CreateUserProductInput, UpdateUserProductInput } from './dto';
import { UsersProducts } from './entities';

@Injectable({ scope: Scope.REQUEST })
export class UsersProductsService {
  constructor(
    private readonly productService: ProductsService,
    private readonly userService: UserService,
    @InjectRepository(UsersProducts)
    private readonly usersProductsRepository: Repository<UsersProducts>,
    @Inject('CATALOG') private readonly catalogClient: ClientKafka,
  ) {}

  async updateProductsInBasket(product: Product): Promise<void> {
    await this.productService.update(product, product.id);
  }

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

    await this.catalogClient
      .emit('SEND_PRODUCT_TO_BASKET_MONGO', {
        product,
        userId,
        amount,
      })
      .toPromise();
  }

  async delete(userId: number, productId: number): Promise<boolean> {
    const existingUserProduct = await this.usersProductsRepository.findOne({
      where: { userId, productId },
    });

    if (!existingUserProduct) {
      throw new RpcException("Specified product doesn't exist in user basket");
    }

    const data = await this.usersProductsRepository.delete({
      userId,
      productId,
    });

    await this.catalogClient
      .emit('DELETE_PRODUCT_IN_BASKET_MONGO', {
        userId,
        productId,
      })
      .toPromise();

    return data.affected > 0;
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
