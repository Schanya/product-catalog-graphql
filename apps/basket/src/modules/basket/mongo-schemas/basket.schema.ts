import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type BasketDocument = HydratedDocument<Basket>;

@Schema()
export class Basket {
  @Prop()
  userId: number;

  @Prop({ name: 'total_price' })
  totalPrice: number;

  @Prop()
  products?: Product[];
}

export class Product {
  title: string;

  price: number;

  currency: string;

  quantity: number;
}

export const BasketSchema = SchemaFactory.createForClass(Basket);
