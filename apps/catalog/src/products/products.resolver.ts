import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ParseIntPipe } from '@nestjs/common';

import { ProductsService } from './products.service';
import { Product } from './entities';

import {
  CreateProductInput,
  FindProductInput,
  UpdateProductInput,
} from './dto';

@Resolver(() => Product)
export class ProductsResolver {
  constructor(private readonly productsService: ProductsService) {}

  @Mutation(() => Product)
  async createProduct(
    @Args('createProductInput') createProductInput: CreateProductInput,
  ) {
    return await this.productsService.create(createProductInput);
  }

  @Query(() => [Product], { name: 'products' })
  async findAll(
    @Args('input', { nullable: true }) findProductInput: FindProductInput,
  ) {
    return await this.productsService.findAll(findProductInput);
  }

  @Query(() => Product, { name: 'product' })
  async findOne(@Args('id', { type: () => Int }) id: number) {
    return await this.productsService.readById(id);
  }

  @Mutation(() => Product)
  async updateProduct(
    @Args('id', ParseIntPipe) id: number,
    @Args('updateProductInput') updateProductInput: UpdateProductInput,
  ) {
    return await this.productsService.update(id, updateProductInput);
  }

  @Mutation(() => Boolean)
  async removeProduct(@Args('id', { type: () => Int }) id: number) {
    return await this.productsService.remove(id);
  }
}
