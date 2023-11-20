import { MigrationInterface, QueryRunner } from 'typeorm';

const productsSeeds = [
  {
    id: 1,
    title: 'Ford Mustang VI',
    price: 35600,
    currency: 'USD',
    quantity: 20,
  },
  {
    id: 2,
    title: 'BYD Han',
    price: 150000,
    currency: 'USD',
    quantity: 5,
  },
  {
    id: 3,
    title: 'Geely Geometry C',
    price: 35000,
    currency: 'USD',
    quantity: 100,
  },
];

export class Seeds1700510291696 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`INSERT INTO "products" ("title", "price", "currency", "quantity")
    VALUES ${productsSeeds
      .map(
        (product) =>
          `('${product.title}', ${product.price}, '${product.currency}', '${product.quantity}')`,
      )
      .join(',')}`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}