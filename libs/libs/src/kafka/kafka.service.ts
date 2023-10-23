import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { KafkaOptions, Transport } from '@nestjs/microservices';

@Injectable()
export class KafkaService {
  constructor(private readonly configService: ConfigService) {}

  getOptions(queue: string): KafkaOptions {
    return {
      transport: Transport.KAFKA,
      options: {
        client: {
          brokers: [this.configService.get<string>('KAFKA_BROKER')],
        },
        consumer: {
          groupId: this.configService.get<string>(`KAFKA_${queue}_CONSUMER`),
        },
      },
    };
  }

  // ack(context: KafkaContext) {
  //   const channel = context.getChannelRef();
  //   const originalMessage = context.getMessage();
  //   channel.ack(originalMessage);
  // }
}
