import { Inject, Injectable } from '@nestjs/common';
import { CreateProductInput } from './dto/create-product.input';
import { UpdateProductInput } from './dto/update-product.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { FindProductInput, SendProductToBasketInput } from './dto';
import { ClientKafka, RpcException } from '@nestjs/microservices';
import { JwtPayloadInput } from '@libs/common';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @Inject('BASKET') private readonly basketClient: ClientKafka,
  ) {}

  async create(createProductInput: CreateProductInput): Promise<Product> {
    const productEntity = this.productRepository.create(createProductInput);
    const createdProduct = await this.productRepository.save(productEntity);

    return createdProduct;
  }

  async findAll(findProductInput: FindProductInput): Promise<Product[]> {
    const products = await this.productRepository.find({
      where: { ...findProductInput },
    });

    return products;
  }

  async readById(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id } });

    return product;
  }

  async update(
    id: number,
    updateProductInput: UpdateProductInput,
  ): Promise<Product> {
    const existingProduct = await this.readById(id);

    if (!existingProduct) {
      throw new RpcException("Specified product doesn't exist");
    }

    const productEntity = this.productRepository.create(updateProductInput);

    const updatedProduct = await this.productRepository.save({
      ...existingProduct,
      ...productEntity,
    });

    return updatedProduct;
  }

  async remove(id: number): Promise<boolean> {
    const existingProduct = await this.readById(id);

    if (!existingProduct) {
      throw new RpcException("Specified product doesn't exist");
    }

    const data = await this.productRepository.delete(id);

    return data && data.affected > 0;
  }

  async sendProductToBasket(
    sendProductToBasketInput: SendProductToBasketInput,
    payload: JwtPayloadInput,
  ): Promise<string> {
    const product = await this.readById(sendProductToBasketInput.id);

    await this.checkTotalAmount(product, sendProductToBasketInput.quantity);

    await this.basketClient
      .emit('SEND_PRODUCT_TO_BASKET', {
        product,
        userId: payload.id,
        amount: sendProductToBasketInput.quantity,
      })
      .toPromise();

    return 'Sent successfully';
  }

  private async checkTotalAmount(
    product: Product,
    amount: number,
  ): Promise<void> {
    if (product.quantity < amount) {
      throw new RpcException(
        'Specified  quantity of the product is more than what is in the catalog',
      );
    }
  }
}
