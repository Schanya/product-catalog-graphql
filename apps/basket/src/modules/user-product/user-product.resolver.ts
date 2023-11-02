import { Resolver } from '@nestjs/graphql';
import { UsersProducts } from './entities';

@Resolver(() => UsersProducts)
export class UsersProductsResolver {}
