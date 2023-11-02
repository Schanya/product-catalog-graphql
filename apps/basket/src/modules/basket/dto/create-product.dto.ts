import { IsNumber, IsString } from 'class-validator';

export class CreateProductDto {
  @IsString()
  title: string;

  @IsNumber()
  price: number;

  @IsString()
  currency: string;

  @IsNumber()
  quantity: number;
}
