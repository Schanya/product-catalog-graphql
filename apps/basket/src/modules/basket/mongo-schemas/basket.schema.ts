import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Product } from './product.schema';

@Schema()
export class Basket {
  @Prop()
  userId: number;

  @Prop()
  products?: Product[];
}

export const BasketSchema = SchemaFactory.createForClass(Basket);
