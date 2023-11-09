import { OmitType, PartialType } from '@nestjs/graphql';
import { CreateProductDto } from './create-product.dto';

export class UpdateProductDto extends OmitType(PartialType(CreateProductDto), [
  'id',
]) {}
