import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateBasketDto, UpdateBasketDto } from './dto';
import { Basket, Product } from './mongo-schemas';

@Injectable()
export class BasketService {
  constructor(@InjectModel('Basket') private basketRepository: Model<Basket>) {}

  async readByUserId(userId: number): Promise<Basket> {
    const basket = await this.basketRepository.findOne({ userId });

    return basket;
  }

  async delete(userId: number, productIds: number[]): Promise<boolean> {
    const deleteResult = await this.basketRepository.updateOne(
      { userId },
      { $pull: { products: { id: { $in: productIds } } } },
    );

    return deleteResult.acknowledged;
  }

  async updateProductsInBasket(
    product: Product,
    users: [{ user_id: number; total_sum: number }],
  ): Promise<void> {
    await this.basketRepository.updateMany(
      { 'products.id': product.id },
      {
        $set: {
          'products.$.title': product.title,
          'products.$.price': product.price,
          'products.$.currency': product.currency,
          'products.$.id': product.id,
        },
      },
    );

    await this.basketRepository.updateMany(
      {
        'products.id': product.id,
        'products.quantity': { $gt: product.quantity },
      },
      {
        $set: { 'products.$.quantity': product.quantity },
      },
    );

    const userIds = [];
    const usersTotalSum = [];

    users.forEach(
      (user) => (
        userIds.push(user.user_id), usersTotalSum.push(user.total_sum)
      ),
    );

    await this.basketRepository.updateMany({ userId: { $in: userIds } }, [
      {
        $set: {
          totalPrice: {
            $arrayElemAt: [
              usersTotalSum,
              { $indexOfArray: [userIds, '$userId'] },
            ],
          },
        },
      },
    ]);
  }

  async addProductToBasket(
    product: Product,
    userId: number,
    amount: number,
  ): Promise<void> {
    const doesBasketExist = await this.basketRepository.findOne({ userId });
    product.quantity = amount;

    if (doesBasketExist) {
      await this.update({ product: product }, userId);
    } else {
      const totalPrice = product.price * product.quantity;

      await this.create({ product: [product], totalPrice, userId });
    }
  }

  async reduceAmountOfPurchasedProduct(products: Product[]): Promise<void> {
    for (const product of products) {
      await this.basketRepository.updateMany(
        {
          'products.id': product.id,
          'products.quantity': { $gt: product.quantity },
        },
        {
          $set: { 'products.$.quantity': product.quantity },
        },
      );
    }
  }

  private async create(createBasketDto: CreateBasketDto): Promise<Basket> {
    const createdBasket = await this.basketRepository.create(createBasketDto);

    createdBasket.$set({ products: createBasketDto.product });

    createdBasket.save();

    return createdBasket;
  }

  private async update(
    updateBasketDto: UpdateBasketDto,
    userId: number,
  ): Promise<Basket> {
    const doesBasketExist = await this.basketRepository.findOne({ userId });

    if (!doesBasketExist) {
      throw new RpcException('The specified cart basket not exist');
    }

    const haveBasketProduct = await this.basketRepository.findOne({
      userId,
      'products.id': updateBasketDto.product.id,
    });

    if (haveBasketProduct) {
      const existedProduct = Array.from(haveBasketProduct.products).find(
        (product) => product.id == updateBasketDto.product.id,
      );

      const totalPrice =
        haveBasketProduct.totalPrice -
        existedProduct.price * existedProduct.quantity +
        updateBasketDto.product.price * updateBasketDto.product.quantity;

      const updatedBasket = await this.basketRepository.findOneAndUpdate(
        { userId, 'products.id': updateBasketDto.product.id },
        {
          $set: {
            'products.$': updateBasketDto.product,
            totalPrice,
          },
        },
      );

      await updatedBasket.save();

      return updatedBasket;
    }

    const totalPrice =
      (doesBasketExist.totalPrice ?? 0) +
      updateBasketDto.product.price * updateBasketDto.product.quantity;

    const updatedBasket = await this.basketRepository.findOneAndUpdate(
      { userId },
      { $push: { products: updateBasketDto.product }, $set: { totalPrice } },
    );

    await updatedBasket.save();

    return updatedBasket;
  }
}
