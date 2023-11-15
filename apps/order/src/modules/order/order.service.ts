import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateOrderDto } from './dto';
import { Order } from './mongo-schemas';

@Injectable()
export class OrderService {
  constructor(@InjectModel('Order') private orderRepository: Model<Order>) {}

  async readByUserId(userId: number): Promise<Order[]> {
    const orders = await this.orderRepository.aggregate([
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

    return orders;
  }

  async readAll(): Promise<Order[]> {
    const orders = await this.orderRepository.aggregate([
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

    return orders;
  }

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const createdOrder = await this.orderRepository.create(createOrderDto);

    createdOrder.$set({ products: createOrderDto.product });
    await createdOrder.save();

    return createdOrder;
  }
}
