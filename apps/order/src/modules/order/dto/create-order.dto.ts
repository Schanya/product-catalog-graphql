import { IsNumber, IsOptional } from 'class-validator';
import { CreateProductDto } from './create-product.dto';

export class CreateOrderDto {
  @IsNumber()
  userId: number;

  @IsOptional()
  product?: CreateProductDto[];
}
