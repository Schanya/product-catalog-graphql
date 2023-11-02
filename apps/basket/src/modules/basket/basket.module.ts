import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BasketController } from './basket.controller';
import { BasketService } from './basket.service';
import { BasketSchema } from './mongo-schemas';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Basket', schema: BasketSchema }]),
  ],
  controllers: [BasketController],
  providers: [BasketService],
  exports: [BasketService],
})
export class BasketModule {}
