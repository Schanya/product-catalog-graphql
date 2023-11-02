import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Basket, BasketSchema } from './mongo-schemas';
import { BasketService } from './basket.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Basket', schema: BasketSchema }]),
  ],
  providers: [BasketService],
  exports: [BasketService],
})
export class BasketModule {}
