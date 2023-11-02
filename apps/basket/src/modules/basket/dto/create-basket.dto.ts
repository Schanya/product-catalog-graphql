import { IsNumber, IsOptional } from 'class-validator';
import { CreateProductDto } from './create-product.dto';

export class CreateBasketDto {
  @IsNumber()
  userId: number;

  @IsNumber()
  totalPrice: number;

  @IsOptional()
  //   @Type((prod) => CreateProductDto)
  product?: CreateProductDto[];
}
