import { IsNotEmpty, IsString } from 'class-validator';
import { SignUpInput } from '../../auth/dto';

export class CreateUserInput extends SignUpInput {
  @IsNotEmpty()
  @IsString()
  passwordSalt: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  login: string;

  @IsNotEmpty()
  @IsString()
  email: string;
}
