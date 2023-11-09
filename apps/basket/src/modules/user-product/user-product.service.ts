import { Inject, Injectable, Scope } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, MoreThan, Repository } from 'typeorm';

import { Product } from '../product/entities';
import { ProductsService } from '../product/product.service';

import { UserService } from '../user/user.service';

import { ClientKafka, RpcException } from '@nestjs/microservices';
import { CreateUserProductInput, UpdateUserProductInput } from './dto';
import { UsersProducts } from './entities';
import { CreatePurchaseInput } from '../payment/dto';
import { BasketMessage } from '@libs/common';

@Injectable()
export class UsersProductsService {
  constructor(
    @Inject('BASKET') private readonly basketClient: ClientKafka,
    @InjectRepository(UsersProducts)
    private readonly usersProductsRepository: Repository<UsersProducts>,
    private readonly productService: ProductsService,
    private readonly userService: UserService,
  ) {}

  async updateProductsInBasket(product: Product): Promise<void> {
    await this.usersProductsRepository.update(
      { amount: MoreThan(product.quantity) },
      { amount: product.quantity },
    );
    await this.productService.update(product, product.id);
  }

  async reduceAmountOfProducts(
    createPurchaseInput: CreatePurchaseInput,
    userId: number,
  ): Promise<{ commonInfo: Product; amount: number }[]> {
    const productIds = createPurchaseInput.productIds;

    const paidProducts = await this.usersProductsRepository.find({
      where: { userId, productId: In(productIds) },
      relations: ['products'],
    });

    if (paidProducts.length !== createPurchaseInput.productIds.length) {
      throw new RpcException("The specified product is not in the user's cart");
    }

    const isValidAmount = paidProducts.some(
      (product) =>
        product.amount == 0 || product.products.quantity < product.amount,
    );

    if (isValidAmount) {
      throw new RpcException(
        'Specified  quantity of the product is more than what is in the catalog',
      );
    }

    await this.productService.updateProductsAmount(paidProducts);

    const reducedProducts = await this.productService.readByIds(
      createPurchaseInput.productIds,
    );

    await this.basketClient
      .emit(BasketMessage.DELETE_MONGO, {
        userId,
        productIds,
      })
      .toPromise();

    await this.basketClient
      .emit(BasketMessage.REDUCE_MONGO, {
        products: reducedProducts,
      })
      .toPromise();

    const products = paidProducts.map((el) => ({
      commonInfo: el.products,
      amount: el.amount,
    }));

    return products;
  }

  async deleteAllPaidProducts(
    createPurchaseInput: CreatePurchaseInput,
    userId: number,
  ): Promise<void> {
    const productIds = createPurchaseInput.productIds;

    const result = await this.usersProductsRepository.delete({
      userId,
      productId: In(productIds),
    });

    console.log(result);
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

    await this.basketClient
      .emit(BasketMessage.SEND_MONGO, {
        product,
        userId,
        amount,
      })
      .toPromise();
  }

  async delete(userId: number, productIds: number[]): Promise<boolean> {
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

    await this.basketClient
      .emit(BasketMessage.DELETE_MONGO, {
        userId,
        productIds,
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
