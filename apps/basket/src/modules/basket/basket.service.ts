import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Basket, Product } from './mongo-schemas';
import { CreateBasketDto, UpdateBasketDto } from './dto';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class BasketService {
  constructor(@InjectModel('Basket') private basketRepository: Model<Basket>) {}

  async readByUserId(userId: number): Promise<Basket> {
    const basket = await this.basketRepository.findOne({ userId });

    return basket;
  }

  async create(createBasketDto: CreateBasketDto): Promise<Basket> {
    const createdBasket = await this.basketRepository.create(createBasketDto);

    createdBasket.$set({ products: createBasketDto.product });

    createdBasket.save();

    return createdBasket;
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

  async update(
    updateBasketDto: UpdateBasketDto,
    userId: number,
  ): Promise<Basket> {
    const doesBasketExist = await this.basketRepository.findOne({ userId });

    if (!doesBasketExist) {
      throw new RpcException('The specified cart basket not exist');
    }

    const updatedBasket = await this.basketRepository.findOneAndUpdate(
      { userId },
      { $push: { products: updateBasketDto.product } },
    );

    const updatedProducts = Array.from(updatedBasket.products);
    updatedProducts.push(updateBasketDto.product);

    const totalPrice = updatedProducts.reduce(
      (sum, product) => ((sum += product.price * product.quantity), sum),
      0,
    );

    updatedBasket.totalPrice = totalPrice;

    await updatedBasket.save();

    return updatedBasket;
  }
}
