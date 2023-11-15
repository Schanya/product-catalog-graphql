import { JwtAuthGuard, JwtPayloadInput, UserParam } from '@libs/common';
import { UseGuards } from '@nestjs/common';
import { Query, Resolver } from '@nestjs/graphql';
import { OrderEntity } from './entities';
import { OrderService } from './order.service';

@UseGuards(JwtAuthGuard)
@Resolver(() => OrderEntity)
export class OrderResolver {
  constructor(private readonly orderService: OrderService) {}

  @Query(() => [OrderEntity], { name: 'getOrder', nullable: true })
  async findOne(@UserParam() user: JwtPayloadInput) {
    const orders = await this.orderService.readByUserId(user.id);

    return orders;
  }

  @Query(() => [OrderEntity], { name: 'getAllOrders', nullable: true })
  async findAll() {
    const orders = await this.orderService.readAll();

    return orders;
  }
}
