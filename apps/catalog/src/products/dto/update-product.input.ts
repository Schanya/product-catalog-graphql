import { CreateProductInput } from './create-product.input';
import { InputType, Field, Int, PartialType, Float } from '@nestjs/graphql';

@InputType()
export class UpdateProductInput extends PartialType(CreateProductInput) {
  @Field({ nullable: true })
  title?: string;

  @Field(() => Float, { nullable: true })
  price?: number;

  @Field({ nullable: true })
  currency?: string;

  @Field(() => Int, { nullable: true })
  quantity?: number;
}
