import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

class CreateOrderRequest {
  userId: string;
  price: number;
}

class OrderCreatedEvent {
  constructor(
    public readonly orderId: string,
    public readonly userId: string,
    public readonly price: number,
  ) {}

  toString() {
    return JSON.stringify({
      orderId: this.orderId,
      userId: this.userId,
      price: this.price,
    });
  }
}

@Injectable()
export class GatewayService {
  constructor(@Inject('CATALOG') private readonly catalogClient: ClientKafka) {}

  getHello(id: number): Promise<string> {
    return this.catalogClient.send<string>('get-hello', { id }).toPromise();
  }
}
