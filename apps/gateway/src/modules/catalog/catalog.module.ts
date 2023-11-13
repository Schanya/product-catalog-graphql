import { Module } from '@nestjs/common';
import { CatalogService } from './catalog.service';

@Module({
  imports: [],
  controllers: [],
  providers: [CatalogService],
  exports: [CatalogService],
})
export class CatalogModule {}
