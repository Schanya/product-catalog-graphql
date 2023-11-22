import { Currency } from '@libs/common';
import {
  Directive,
  Field,
  Float,
  Int,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';

registerEnumType(Currency, {
  name: 'Currency',
});

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

  @Field(() => Currency)
  currency: string;

  @Field(() => Int)
  quantity: number;
}
