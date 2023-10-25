import {
  Controller,
  Get,
  Inject,
  OnModuleInit,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { CatalogService } from './catalog.service';

@Controller()
export class CatalogController implements OnModuleInit {
  constructor(
    private readonly catalogService: CatalogService,
    @Inject('CATALOG') private readonly catalogClient: ClientKafka,
  ) {}

  @Get(':id')
  async getHello(@Param('id', ParseIntPipe) id: number): Promise<string> {
    return await this.catalogService.getHello(id);
  }

  onModuleInit() {
    this.catalogClient.subscribeToResponseOf('get-hello');
  }
}
