import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type BasketDocument = HydratedDocument<Basket>;

export class Product {
  id: number;
  title: string;
  price: number;
  currency: string;
  quantity: number;
}

@Schema()
export class Basket {
  @Prop()
  userId: number;

  @Prop({ name: 'total_price' })
  totalPrice: number;

  @Prop()
  products?: Product[];
}

export const BasketSchema = SchemaFactory.createForClass(Basket);
