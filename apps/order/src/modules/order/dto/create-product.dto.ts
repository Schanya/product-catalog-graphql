import { IsNumber, IsString } from 'class-validator';

export class CreateProductDto {
  @IsNumber()
  id: number;

  @IsString()
  title: string;

  @IsNumber()
  price: number;

  @IsString()
  currency: string;

  @IsNumber()
  quantity: number;
}
