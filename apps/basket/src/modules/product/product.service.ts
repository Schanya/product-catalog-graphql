import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Product } from './entities/product.entity';
import { ClientKafka, RpcException } from '@nestjs/microservices';
import { CreateProductDto, UpdateProductDto } from './dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @Inject('CATALOG') private readonly catalogClient: ClientKafka,
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

    const query = `
  SELECT u.id AS user_id, SUM(p.price * up.amount) AS total_sum
  FROM public.users AS u
  JOIN public.users_products AS up ON u.id = up.user_id
  JOIN public.products AS p ON p.id = up.product_id
  WHERE u.id IN (
    SELECT user_id
    FROM public.users_products
    WHERE product_id = ${id}
  )
  GROUP BY u.id;
  `;

    const result = await this.productRepository.query(query);

    await this.catalogClient
      .emit('UPDATE_PRODUCT_IN_BASKET_MONGO', {
        users: result,
        product: updateProductDto,
      })
      .toPromise();

    return updatedProduct;
  }

  async doesProductExist(id: number): Promise<Boolean> {
    const doesProductExist = await this.productRepository.exist({
      where: { id },
    });

    return doesProductExist;
  }
}
