import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class GatewayService {
  constructor(@Inject('CATALOG') private readonly catalogClient: ClientKafka) {}

  getHello(id: number): Promise<string> {
    return this.catalogClient.send<string>('get-hello', { id }).toPromise();
  }
}
