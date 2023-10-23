import {
  Controller,
  Get,
  Inject,
  OnModuleInit,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { GatewayService } from './gateway.service';

@Controller()
export class GatewayController implements OnModuleInit {
  constructor(
    private readonly appService: GatewayService,
    @Inject('CATALOG') private readonly catalogClient: ClientKafka,
  ) {}

  @Get(':id')
  async getHello(@Param('id', ParseIntPipe) id: number): Promise<string> {
    return await this.appService.getHello(id);
  }

  onModuleInit() {
    this.catalogClient.subscribeToResponseOf('get-hello');
  }
}
