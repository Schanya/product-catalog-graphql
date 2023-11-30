import { OrderMessage, RedisService } from '@libs/common';
import { Controller, ParseIntPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateProductDto } from './dto';
import { OrderService } from './order.service';
import { getOrderCacheKey } from '../../common';

@Controller()
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly cache: RedisService,
  ) {}

  @MessagePattern(OrderMessage.ADD_ORDER)
  async saveProductToBasket(
    @Payload('products') products: CreateProductDto[],
    @Payload('userId', ParseIntPipe) userId: number,
  ): Promise<void> {
    await this.cache.del(getOrderCacheKey());

    await this.orderService.create({ product: products, userId });
  }
}
