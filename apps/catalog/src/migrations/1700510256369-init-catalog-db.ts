import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitCatalogDb1700510256369 implements MigrationInterface {
  name = 'InitCatalogDb1700510256369';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "products" ("id" SERIAL NOT NULL, "title" text NOT NULL, "price" real NOT NULL, "currency" text NOT NULL, "quantity" integer NOT NULL, CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "products"`);
  }
}
