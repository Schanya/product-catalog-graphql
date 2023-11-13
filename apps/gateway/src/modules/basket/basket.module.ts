import { Module } from '@nestjs/common';
import { BasketService } from './basket.service';

@Module({
  imports: [],
  controllers: [],
  providers: [BasketService],
  exports: [BasketService],
})
export class BasketModule {}
