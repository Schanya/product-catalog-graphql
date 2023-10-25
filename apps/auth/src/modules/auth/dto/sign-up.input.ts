import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

@InputType()
export class SignUpInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  login: string;

  @Field()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  @Length(4)
  password: string;
}
