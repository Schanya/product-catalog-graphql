import { Field, InputType, Int } from '@nestjs/graphql';
import { IsArray, IsNumber } from 'class-validator';

@InputType()
export class CreatePurchaseInput {
  @Field(() => [Int])
  @IsNumber({}, { each: true })
  @IsArray()
  productIds?: number[];
}
