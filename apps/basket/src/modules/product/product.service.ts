import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Product } from './entities/product.entity';
import { RpcException } from '@nestjs/microservices';
import { CreateProductDto } from './dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async readById(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id } });

    return product;
  }

  async create(createProductDto: CreateProductDto): Promise<Product> {
    if (await this.doesProductExist(createProductDto.id)) {
      throw new RpcException('Specified product already exists');
    }
    const productEntity = this.productRepository.create(createProductDto);
    const createdProduct = await this.productRepository.save(productEntity);

    return createdProduct;
  }

  async createIfNotExist(product: Product): Promise<void> {
    if (!(await this.doesProductExist(product.id))) {
      await this.create(product);
    }
  }

  async doesProductExist(id: number): Promise<Boolean> {
    const doesProductExist = await this.productRepository.exist({
      where: { id },
    });

    return doesProductExist;
  }
}
