import {
  Controller,
  Get,
  Inject,
  OnModuleInit,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { BasketService } from './basket.service';

@Controller()
export class BasketController implements OnModuleInit {
  constructor(
    private readonly basketService: BasketService,
    @Inject('BASKET') private readonly basketClient: ClientKafka,
  ) {}

  @Get(':id')
  async getHello(@Param('id', ParseIntPipe) id: number): Promise<string> {
    return await this.basketService.getHello(id);
  }

  onModuleInit() {
    this.basketClient.subscribeToResponseOf('get-hello');
  }
}
