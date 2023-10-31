import { Controller, ParseIntPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CatalogService } from './catalog.service';
import { Product } from './products/entities';

@Controller()
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  @MessagePattern('get-hello')
  getHello(@Payload('id', ParseIntPipe) id: number): string {
    return this.catalogService.getHello(id);
  }

  @MessagePattern('GET_BY_ID')
  async readById(@Payload('id', ParseIntPipe) id: number): Promise<string> {
    return JSON.stringify(await this.catalogService.readById(id));
  }
}
