import { Injectable } from '@nestjs/common';
import { ProductsService } from './products/products.service';
import { Product } from './products/entities';

@Injectable()
export class CatalogService {
  constructor(private readonly productService: ProductsService) {}

  getHello(id: number): string {
    return `Hello World!\n You sent id: ${id}`;
  }

  async readById(id: number): Promise<Product> {
    return await this.productService.readById(id);
  }
}
