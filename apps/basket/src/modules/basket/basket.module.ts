import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BasketController } from './basket.controller';
import { BasketService } from './basket.service';
import { BasketSchema } from './mongo-schemas';
import { RedisModule } from '@libs/common';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Basket', schema: BasketSchema }]),
    RedisModule,
  ],
  controllers: [BasketController],
  providers: [BasketService],
  exports: [BasketService],
})
export class BasketModule {}
