import { InputType } from '@nestjs/graphql';
import { UpdateProductInput } from './update-product.input';

@InputType()
export class FindProductInput extends UpdateProductInput {}
