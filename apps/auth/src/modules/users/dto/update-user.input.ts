import { Field, InputType, PartialType } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';
import { SignInInput } from '../../auth/dto';

@InputType()
export class UpdateUserInput extends PartialType(SignInInput) {
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  login?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  passwordSalt?: string;
}
