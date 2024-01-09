import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { Product } from './entities/product.entity';
import { ClientKafka, RpcException } from '@nestjs/microservices';
import { CreateProductDto, UpdateProductDto } from './dto';
import { UsersProducts } from '../user-product/entities';
import { BasketMessage, EmitEvent } from '@libs/common';

@Injectable()
export class ProductsService {
  constructor(
    @Inject('BASKET') private readonly basketClient: ClientKafka,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async readById(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id } });

    return product;
  }

  async readByIds(ids: number[]): Promise<Product[]> {
    const products = await this.productRepository.find({
      where: { id: In(ids) },
    });

    return products;
  }

  async update(
    updateProductDto: UpdateProductDto,
    id: number,
  ): Promise<Product> {
    const existingProduct = await this.readById(id);

    if (!existingProduct) {
      throw new RpcException("Specified product doesn't exist");
    }

    const productEntity = this.productRepository.create(updateProductDto);

    const updatedProduct = await this.productRepository.save({
      ...existingProduct,
      ...productEntity,
    });

    await this._emitBasketEvent(BasketMessage.UPDATE_MONGO, {
      product: updateProductDto,
    });

    return updatedProduct;
  }

  async updateProductsAmount(
    paidProducts: UsersProducts[],
  ): Promise<Product[]> {
    const productIds = paidProducts.map((paidProduct) => paidProduct.productId);

    const products = await this.productRepository.find({
      where: { id: In(productIds) },
    });

    const updatedPromises = products.map((product) => {
      const userAmount = paidProducts.find(
        (el) => el.productId == product.id,
      ).amount;

      product.quantity -= userAmount;

      product.save();
    });

    await Promise.all(updatedPromises);

    return products;
  }

  async createIfNotExist(product: Product): Promise<void> {
    if (!(await this.doesProductExist(product.id))) {
      await this.create(product);
    }
  }

  private async doesProductExist(id: number): Promise<boolean> {
    const doesProductExist = await this.productRepository.exist({
      where: { id },
    });

    return doesProductExist;
  }

  private async create(createProductDto: CreateProductDto): Promise<Product> {
    const productEntity = this.productRepository.create(createProductDto);
    const createdProduct = await this.productRepository.save(productEntity);

    return createdProduct;
  }

  private async _emitBasketEvent<T>(pattern: string, data: any): Promise<T> {
    const res = await EmitEvent<T>({
      client: this.basketClient,
      pattern,
      data,
    });

    return res;
  }
}
