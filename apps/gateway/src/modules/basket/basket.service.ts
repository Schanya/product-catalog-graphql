import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class BasketService {
  constructor(@Inject('BASKET') private readonly basketClient: ClientKafka) {}

  getHello(id: number): Promise<string> {
    return this.basketClient.send<string>('get-hello', { id }).toPromise();
  }
}
