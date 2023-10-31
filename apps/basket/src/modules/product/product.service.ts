import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka, RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { sendMessage } from '@libs/common';

import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @Inject('CATALOG') private readonly catalogClient: ClientKafka,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async readById(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id } });

    return product;
  }

  async create(id: number): Promise<Product> {
    if (await this.doesProductExist(id)) {
      throw new RpcException('Specified product already exists');
    }

    const product = await this.sendMessageToCotalog<Product>('GET_BY_ID', {
      id,
    });

    if (!product) {
      throw new RpcException('Specified product does not exist in the catalog');
    }

    const productEntity = this.productRepository.create(product);
    const createdProduct = await this.productRepository.save(productEntity);

    return createdProduct;
  }

  async doesProductExist(id: number): Promise<Boolean> {
    const product = await this.sendMessageToCotalog<Product>('GET_BY_ID', {
      id,
    });

    const doesProductExist = await this.productRepository.exist({
      where: { id: product.id },
    });

    return doesProductExist;
  }

  private async sendMessageToCotalog<T>(
    pattern: string,
    data: any,
  ): Promise<T> {
    const response = await sendMessage<T>({
      client: this.catalogClient,
      pattern,
      data,
    });

    return response;
  }
}
