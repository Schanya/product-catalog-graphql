import { Controller, ParseIntPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CatalogService } from './catalog.service';

@Controller()
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  @MessagePattern('get-hello')
  getHello(@Payload('id', ParseIntPipe) id: number): string {
    return this.catalogService.getHello(id);
  }
}
