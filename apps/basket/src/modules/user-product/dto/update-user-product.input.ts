import { InputType, OmitType } from '@nestjs/graphql';
import { CreateUserProductInput } from './create-user-product.input';

@InputType()
export class UpdateUserProductInput extends OmitType(CreateUserProductInput, [
  'productId',
  'userId',
]) {}
