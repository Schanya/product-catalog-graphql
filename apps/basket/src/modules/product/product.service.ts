import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { Product } from './entities/product.entity';
import { ClientKafka, RpcException } from '@nestjs/microservices';
import { CreateProductDto, UpdateProductDto } from './dto';
import { UsersProducts } from '../user-product/entities';
import { BasketMessage } from '@libs/common';

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

    await this.basketClient
      .emit(BasketMessage.UPDATE_MONGO, {
        users: result,
        product: updateProductDto,
      })
      .toPromise();

    return updatedProduct;
  }

  async updateProductsAmount(paidProducts: UsersProducts[]): Promise<void> {
    const productIds = paidProducts.map((paidProduct) => paidProduct.productId);

    const products = await this.productRepository.find({
      where: { id: In(productIds) },
    });

    const updatedPromises = products.map((product) => {
      product.quantity -= paidProducts.find(
        (el) => el.productId == product.id,
      ).amount;

      product.save();
    });

    await Promise.all(updatedPromises);
  }

  async doesProductExist(id: number): Promise<Boolean> {
    const doesProductExist = await this.productRepository.exist({
      where: { id },
    });

    return doesProductExist;
  }
}
