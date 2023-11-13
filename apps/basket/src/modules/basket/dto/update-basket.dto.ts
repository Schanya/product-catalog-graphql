import { IsNotEmpty } from 'class-validator';
import { CreateProductDto } from './create-product.dto';

export class UpdateBasketDto {
  @IsNotEmpty()
  product: CreateProductDto;
}
