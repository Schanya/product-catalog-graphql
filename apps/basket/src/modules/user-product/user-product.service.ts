import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka, RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { In, MoreThan, Repository } from 'typeorm';

import { Product } from '../product/entities';
import { ProductsService } from '../product/product.service';

import { UserService } from '../user/user.service';

import { BasketMessage, EmitEvent } from '@libs/common';

import { CreatePurchaseInput } from '../payment/dto';
import { CreateUserProductInput, UpdateUserProductInput } from './dto';
import { UsersProducts } from './entities';

@Injectable()
export class UsersProductsService {
  constructor(
    @Inject('BASKET') private readonly basketClient: ClientKafka,
    @InjectRepository(UsersProducts)
    private readonly usersProductsRepository: Repository<UsersProducts>,
    private readonly productService: ProductsService,
    private readonly userService: UserService,
  ) {}

  async deleteProductIfDeletedInCatalog(productId: number): Promise<void> {
    await this.usersProductsRepository.delete({ productId });

    await this._emitBasketEvent(BasketMessage.DELETE_PODUCT_MONGO, {
      productId,
    });
  }

  async readByUserIdAndProductIds(
    userId: number,
    productIds: number[],
  ): Promise<UsersProducts[]> {
    const userProduct = await this.usersProductsRepository
      .createQueryBuilder('users_products')
      .innerJoin('users_products.products', 'products')
      .where(`users_products.user_id = :userId`, { userId })
      .andWhere('users_products.product_id IN (:...productIds)', { productIds })
      .getMany();

    return userProduct;
  }

  async updateProductsInBasket(product: Product): Promise<void> {
    await this.usersProductsRepository.update(
      { amount: MoreThan(product.quantity) },
      { amount: product.quantity },
    );
    await this.productService.update(product, product.id);
  }

  async updateProductsAmountForEachUser(product: Product): Promise<void> {
    await this.usersProductsRepository.update(
      { productId: product.id, amount: MoreThan(product.quantity) },
      { amount: product.quantity },
    );
  }

  async reduceAmountOfProducts(
    createPurchaseInput: CreatePurchaseInput,
    userId: number,
  ): Promise<{ commonInfo: Product; amount: number }[]> {
    const productIds = createPurchaseInput.productIds;

    const existedProducts = await this.usersProductsRepository.find({
      where: { userId, productId: In(productIds) },
      relations: ['products'],
    });

    if (existedProducts.length !== createPurchaseInput.productIds.length) {
      throw new RpcException(
        "The specified product is not in the user's basket",
      );
    }

    const isValidAmount = existedProducts.some(
      (product) =>
        product.amount == 0 || product.products.quantity < product.amount,
    );

    if (isValidAmount) {
      throw new RpcException(
        'Specified  quantity of the product is more than what is in the catalog',
      );
    }

    const updatedProducts =
      await this.productService.updateProductsAmount(existedProducts);

    await this._emitBasketEvent(BasketMessage.REDUCE_MONGO, {
      products: updatedProducts,
    });

    const products = existedProducts.map((el) => ({
      commonInfo: el.products,
      amount: el.amount,
    }));

    return products;
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

    await this._emitBasketEvent(BasketMessage.SEND_MONGO, {
      product,
      userId,
      amount,
    });
  }

  async deleteProductsForUser(
    userId: number,
    productIds: number[],
  ): Promise<boolean> {
    const existingUserProduct = await this.usersProductsRepository.findOne({
      where: { userId, productId: In(productIds) },
    });

    if (!existingUserProduct) {
      throw new RpcException("Specified product doesn't exist in user basket");
    }

    const data = await this.usersProductsRepository.delete({
      userId,
      productId: In(productIds),
    });

    await this._emitBasketEvent(BasketMessage.DELETE_MONGO, {
      userId,
      productIds,
    });

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

  private async _emitBasketEvent<T>(pattern: string, data: any): Promise<T> {
    const res = await EmitEvent<T>({
      client: this.basketClient,
      pattern,
      data,
    });

    return res;
  }
}
