import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type OrderDocument = HydratedDocument<Order>;

export class Product {
  id: number;
  title: string;
  price: number;
  currency: string;
  quantity: number;
}

@Schema()
export class Order {
  @Prop()
  userId: number;

  @Prop()
  products?: Product[];
}

export const OrderSchema = SchemaFactory.createForClass(Order);
