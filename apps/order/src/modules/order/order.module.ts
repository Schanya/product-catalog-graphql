import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { OrderSchema } from './mongo-schemas';
import { OrderResolver } from './order.resolver';
import { RedisModule } from '@libs/common';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Order', schema: OrderSchema }]),
    RedisModule,
  ],
  controllers: [OrderController],
  providers: [OrderResolver, OrderService],
  exports: [OrderService],
})
export class OrderModule {}
