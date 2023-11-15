import { ParseIntPipe, UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';

import { JwtAuthGuard, JwtPayloadInput, UserParam } from '@libs/common';

import { Product } from './entities';
import { ProductsService } from './products.service';

import {
  CreateProductInput,
  FindProductInput,
  SendProductToBasketInput,
  UpdateProductInput,
} from './dto';

@UseGuards(JwtAuthGuard)
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
