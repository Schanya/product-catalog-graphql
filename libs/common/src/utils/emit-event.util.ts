import { SendMessageOptions } from './send-message.util';

export type EmitMessageOptions = SendMessageOptions;

export async function EmitEvent<T>(options: EmitMessageOptions): Promise<T> {
  const { client, pattern, data } = options;
  const response = await client.emit(pattern, data).toPromise();

  return response;
}
