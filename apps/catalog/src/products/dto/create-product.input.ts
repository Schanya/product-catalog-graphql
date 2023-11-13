import { InputType, Int, Field, Float } from '@nestjs/graphql';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
  Min,
} from 'class-validator';

@InputType()
export class CreateProductInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  @Length(2, 20)
  title: string;

  @Field(() => Float)
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  price: number;

  @Field()
  @IsString()
  @IsNotEmpty()
  @Length(1, 15)
  currency: string;

  @Field(() => Int)
  @IsInt()
  @IsNotEmpty()
  @Min(0)
  quantity: number;
}
