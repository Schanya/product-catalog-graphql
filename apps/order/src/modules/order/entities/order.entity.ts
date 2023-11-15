import { Directive, Field, Int, ObjectType } from '@nestjs/graphql';
import { Product } from './product.entity';

@ObjectType()
@Directive('@shareable')
@Directive('@key(fields: "_id")')
export class OrderEntity {
  @Field()
  _id: string;

  @Field(() => Int)
  userId: number;

  @Field(() => Int)
  totalPrice: number;

  @Field(() => [Product])
  products: Product[];
}
