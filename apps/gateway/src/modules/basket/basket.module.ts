import { Module } from '@nestjs/common';
import { KafkaModule } from '@libs/common';
import { BasketService } from './basket.service';

const DefinitionKafkaModule = KafkaModule.register({
  name: 'BASKET',
});

@Module({
  imports: [DefinitionKafkaModule],
  controllers: [],
  providers: [BasketService],
  exports: [BasketService],
})
export class BasketModule {}
