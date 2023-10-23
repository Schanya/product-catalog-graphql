import { Injectable } from '@nestjs/common';
import { CreateProductInput } from './dto/create-product.input';
import { UpdateProductInput } from './dto/update-product.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { FindProductInput } from './dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) {}

  async create(createProductInput: CreateProductInput): Promise<Product> {
    const productEntity = this.productRepo.create(createProductInput);
    const createdProduct = await this.productRepo.save(productEntity);

    return createdProduct;
  }

  async findAll(findProductInput: FindProductInput): Promise<Product[]> {
    const products = await this.productRepo.find({
      where: { ...findProductInput },
    });

    return products;
  }

  async readById(id: number): Promise<Product> {
    const product = await this.productRepo.findOne({ where: { id } });

    return product;
  }

  async update(
    id: number,
    updateProductInput: UpdateProductInput,
  ): Promise<Product> {
    const existingProduct = await this.readById(id);
    const productEntity = this.productRepo.create(updateProductInput);

    const updatedProduct = await this.productRepo.save({
      ...existingProduct,
      ...productEntity,
    });

    return updatedProduct;
  }

  async remove(id: number): Promise<boolean> {
    const data = await this.productRepo.delete(id);

    return data && data.affected > 0;
  }
}
