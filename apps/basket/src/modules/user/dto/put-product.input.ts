import { InputType, Int, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber, IsOptional, Min } from 'class-validator';

@InputType()
export class PutProductInput {
  @Field(() => Int)
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @Field(() => Int, { nullable: true })
  @IsNumber()
  @IsOptional()
  @Min(1)
  amount?: number = 1;
}
