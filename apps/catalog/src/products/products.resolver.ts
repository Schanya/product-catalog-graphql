import { ParseIntPipe, UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';

import {
  JwtAuthGuard,
  JwtPayloadInput,
  RedisService,
  Role,
  Roles,
  RolesGuard,
  UserParam,
} from '@libs/common';

import { Product } from './entities';
import { ProductsService } from './products.service';

import {
  CreateProductInput,
  FindProductInput,
  SendProductToBasketInput,
  UpdateProductInput,
} from './dto';
import { getProductCacheKey } from '../common';

@Roles(Role.ADMIN, Role.USER)
@UseGuards(RolesGuard)
@UseGuards(JwtAuthGuard)
@Resolver(() => Product)
export class ProductsResolver {
  constructor(
    private readonly productsService: ProductsService,
    private readonly cache: RedisService,
  ) {}

  @Roles(Role.ADMIN)
  @Mutation(() => Product)
  async createProduct(
    @Args('createProductInput') createProductInput: CreateProductInput,
  ) {
    await this.cache.del(getProductCacheKey());

    return await this.productsService.create(createProductInput);
  }

  @Query(() => [Product], { name: 'products' })
  async findAll(
    @Args('input', { nullable: true }) findProductInput: FindProductInput,
  ) {
    const key = getProductCacheKey();

    const fromCache = await this.cache.get(key);
    if (fromCache) {
      return fromCache;
    }

    const products = await this.productsService.findAll(findProductInput);
    await this.cache.set(key, products);

    return products;
  }

  @Query(() => Product, { name: 'product' })
  async findOne(@Args('id', { type: () => Int }) id: number) {
    const key = getProductCacheKey(id);

    const fromCache = await this.cache.get(getProductCacheKey(id));
    if (fromCache) {
      return fromCache;
    }

    const product = await this.productsService.readById(id);
    await this.cache.set(key, product);

    return product;
  }

  @Roles(Role.ADMIN)
  @Mutation(() => Product)
  async updateProduct(
    @Args('id', ParseIntPipe) id: number,
    @Args('updateProductInput') updateProductInput: UpdateProductInput,
  ) {
    await this.cache.del(getProductCacheKey());
    await this.cache.del(getProductCacheKey(id));

    return await this.productsService.update(id, updateProductInput);
  }

  @Roles(Role.ADMIN)
  @Mutation(() => Boolean)
  async removeProduct(@Args('id', { type: () => Int }) id: number) {
    await this.cache.del(getProductCacheKey());
    await this.cache.del(getProductCacheKey(id));

    return await this.productsService.remove(id);
  }

  @Mutation(() => String)
  async sendProductToBasket(
    @Args('sendProductToBasketInput')
    sendProductToBasketInput: SendProductToBasketInput,
    @UserParam() payload: JwtPayloadInput,
  ): Promise<string> {
    return await this.productsService.sendProductToBasket(
      sendProductToBasketInput,
      payload,
    );
  }
}
