import { Controller, Get, ParseIntPipe } from '@nestjs/common';
import { CatalogService } from './catalog.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  @MessagePattern('get-hello')
  getHello(@Payload('id', ParseIntPipe) id: number): string {
    return this.catalogService.getHello(id);
  }
}
