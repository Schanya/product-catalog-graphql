import { OmitType, PartialType } from '@nestjs/graphql';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
  Min,
} from 'class-validator';
import { CreateProductDto } from './create-product.dto';

export class UpdateProductDto extends OmitType(PartialType(CreateProductDto), [
  'id',
]) {}
