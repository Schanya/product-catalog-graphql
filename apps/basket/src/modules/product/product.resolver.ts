import { Parent, ResolveField, Resolver } from '@nestjs/graphql';

import { Product } from './entities';
import { UsersProducts } from '../user/entities';
import { UsersProductsService } from '../user/user-product.service';

@Resolver(() => Product)
export class ProductResolver {
  // constructor(private readonly usersProductsService: UsersProductsService) {}
  // @ResolveField(() => UsersProducts)
  // async basketProduct(@Parent() product: Product): Promise<UsersProducts> {
  //   return await this.usersProductsService.readByProductId(product.id);
  // }
}
