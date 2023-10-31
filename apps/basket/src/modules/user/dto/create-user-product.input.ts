import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNumber, IsOptional, Min } from 'class-validator';

@InputType()
export class CreateUserProductInput {
  @Field(() => Int, { nullable: true })
  @IsNumber()
  @IsOptional()
  @Min(1)
  amount?: number = 1;

  @Field(() => Int)
  @IsNumber()
  userId: number;

  @Field(() => Int)
  @IsNumber()
  productId: number;
}
