import { Field, InputType, Int, OmitType } from '@nestjs/graphql';
import { CreateProductInput } from './create-product.input';
import { IsNotEmpty, IsNumber } from 'class-validator';

@InputType()
export class SendProductToBasketInput extends OmitType(CreateProductInput, [
  'currency',
  'price',
  'title',
]) {
  @Field(() => Int)
  @IsNumber()
  @IsNotEmpty()
  id: number;
}
