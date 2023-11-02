import { Resolver } from '@nestjs/graphql';

import { Product } from './entities';

@Resolver(() => Product)
export class ProductResolver {
  // constructor(private readonly usersProductsService: UsersProductsService) {}
  // @ResolveField(() => UsersProducts)
  // async basketProduct(@Parent() product: Product): Promise<UsersProducts> {
  //   return await this.usersProductsService.readByProductId(product.id);
  // }
}
