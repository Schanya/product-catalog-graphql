import { BasketMessage, OrderMessage } from '@libs/common';
import { Controller, ParseIntPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateProductDto } from './dto';
import { OrderService } from './order.service';

@Controller()
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @MessagePattern(OrderMessage.ADD_ORDER)
  async saveProductToBasket(
    @Payload('products') products: CreateProductDto[],
    @Payload('userId', ParseIntPipe) userId: number,
  ): Promise<void> {
    await this.orderService.create({ product: products, userId });
  }
}
