import {
  JwtAuthGuard,
  JwtPayloadInput,
  RedisService,
  Role,
  Roles,
  RolesGuard,
  UserParam,
} from '@libs/common';
import { UseGuards } from '@nestjs/common';
import { Query, Resolver } from '@nestjs/graphql';
import { OrderEntity } from './entities';
import { OrderService } from './order.service';
import { getOrderCacheKey } from '../../common';

@Roles(Role.ADMIN, Role.USER)
@UseGuards(RolesGuard)
@UseGuards(JwtAuthGuard)
@Resolver(() => OrderEntity)
export class OrderResolver {
  constructor(
    private readonly orderService: OrderService,
    private readonly cache: RedisService,
  ) {}

  @Query(() => [OrderEntity], { name: 'getOrder', nullable: true })
  async findOne(@UserParam() user: JwtPayloadInput) {
    const key = getOrderCacheKey();

    const fromCache = await this.cache.get(key);
    if (fromCache) {
      return fromCache;
    }

    const orders = await this.orderService.readByUserId(user.id);
    await this.cache.set(key, orders);

    return orders;
  }

  @Roles(Role.ADMIN)
  @Query(() => [OrderEntity], { name: 'getAllOrders', nullable: true })
  async findAll() {
    const key = getOrderCacheKey();

    const fromCache = await this.cache.get(key);
    if (fromCache) {
      return fromCache;
    }

    const orders = await this.orderService.readAll();
    await this.cache.set(key, orders);

    return orders;
  }
}
