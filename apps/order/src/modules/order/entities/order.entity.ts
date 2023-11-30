import { Product } from './product.entity';

export class OrderEntity {
  _id: string;

  userId: number;

  totalPrice: number;

  products: Product[];
}
