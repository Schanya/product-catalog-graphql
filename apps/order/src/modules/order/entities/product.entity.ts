import { Directive, Field, Float, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Directive('@shareable')
@Directive('@key(fields: "id")')
export class Product {
  @Field(() => Int)
  id: number;

  @Field()
  title: string;

  @Field(() => Float)
  price: number;

  @Field()
  currency: string;

  @Field(() => Int)
  quantity: number;
}
