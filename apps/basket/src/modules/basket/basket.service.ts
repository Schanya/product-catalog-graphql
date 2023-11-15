import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateBasketDto, UpdateBasketDto } from './dto';
import { Basket, Product } from './mongo-schemas';

@Injectable()
export class BasketService {
  constructor(@InjectModel('Basket') private basketRepository: Model<Basket>) {}

  async readBasketByUserId(userId: number): Promise<any> {
    const basket = await this.basketRepository.aggregate([
      { $match: { userId } },
      {
        $unwind: '$products',
      },
      {
        $group: {
          _id: '$_id',
          userId: { $first: '$userId' },
          products: { $push: '$products' },
          totalPrice: {
            $sum: { $multiply: ['$products.price', '$products.quantity'] },
          },
        },
      },
    ]);

    return basket[0];
  }

  async deleteProductsFromBasket(
    userId: number,
    productIds: number[],
  ): Promise<boolean> {
    const deleteResult = await this.basketRepository.updateOne(
      { userId },
      { $pull: { products: { id: { $in: productIds } } } },
    );

    return deleteResult.acknowledged;
  }

  async deleteProductIfDeletedInCatalog(productId: number): Promise<void> {
    const deleteResult = await this.basketRepository.updateOne({
      $pull: { products: { id: productId } },
    });
  }

  async updateProductForEachUser(product: Product): Promise<void> {
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

  async addProductToBasket(
    product: Product,
    userId: number,
    amount: number,
  ): Promise<void> {
    const doesBasketExist = await this.basketRepository.findOne({ userId });
    product.quantity = amount;

    if (doesBasketExist) {
      await this.updateBasket({ product: product }, userId);
    } else {
      await this.createBasket({ product: [product], userId });
    }
  }

  private async createBasket(
    createBasketDto: CreateBasketDto,
  ): Promise<Basket> {
    const createdBasket = await this.basketRepository.create(createBasketDto);

    createdBasket.$set({ products: createBasketDto.product });
    await createdBasket.save();

    return createdBasket;
  }

  private async updateBasket(
    updateBasketDto: UpdateBasketDto,
    userId: number,
  ): Promise<Basket> {
    const haveBasketProduct = await this.basketRepository.findOne({
      userId,
      'products.id': updateBasketDto.product.id,
    });

    const updatedBasket = haveBasketProduct
      ? await this.basketRepository.findOneAndUpdate(
          { userId, 'products.id': updateBasketDto.product.id },
          {
            $set: { 'products.$': updateBasketDto.product },
          },
        )
      : await this.basketRepository.findOneAndUpdate(
          { userId },
          { $push: { products: updateBasketDto.product } },
        );

    await updatedBasket.save();

    return updatedBasket;
  }
}
