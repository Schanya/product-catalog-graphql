import { Injectable } from '@nestjs/common';

@Injectable()
export class CatalogService {
  getHello(id: number): string {
    return `Hello World!\n You sent id: ${id}`;
  }
}
