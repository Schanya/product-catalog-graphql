import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Basket } from './mongo-schemas';
import { CreateBasketDto } from './dto';

@Injectable()
export class BasketService {
  constructor(@InjectModel('Basket') private basketRepository: Model<Basket>) {}
  async create(createBasketDto: CreateBasketDto): Promise<Basket> {
    const createdBasket = new this.basketRepository(createBasketDto);

    return createdBasket.save();
  }
}
