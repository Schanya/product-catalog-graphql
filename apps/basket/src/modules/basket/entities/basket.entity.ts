import { Directive, Field, Int, ObjectType } from '@nestjs/graphql';
import { Product } from '../../product/entities';

@ObjectType()
@Directive('@key(fields: "_id")')
export class BasketEntity {
  @Field()
  _id: string;

  @Field(() => Int)
  userId: number;

  @Field(() => Int)
  totalPrice: number;

  @Field(() => [Product])
  products: Product[];
}
