import { ClientProxy } from '@nestjs/microservices';

export type SendMessageOptions = {
  client: ClientProxy;
  pattern: string;
  data: any;
};

export async function sendMessage<T>(options: SendMessageOptions): Promise<T> {
  const { client, pattern, data } = options;
  const response = await client.send(pattern, data).toPromise();

  return response;
}
