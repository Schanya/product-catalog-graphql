import { Module } from '@nestjs/common';
import { KafkaModule } from '@libs/common';
import { CatalogService } from './catalog.service';

const DefinitionKafkaModule = KafkaModule.register({
  name: 'CATALOG',
});

@Module({
  imports: [DefinitionKafkaModule],
  controllers: [],
  providers: [CatalogService],
  exports: [CatalogService],
})
export class CatalogModule {}
