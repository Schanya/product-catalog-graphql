import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitBasketDb1700806124394 implements MigrationInterface {
  name = 'InitBasketDb1700806124394';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "products_currency_enum" AS ENUM ('USD', 'RUB')`,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" integer NOT NULL, CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "products" ("id" integer NOT NULL, "title" text NOT NULL, "price" real NOT NULL, "currency" "public"."products_currency_enum" NOT NULL DEFAULT 'USD', "quantity" integer NOT NULL, CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "users_products" ("id" SERIAL NOT NULL, "user_id" integer NOT NULL, "product_id" integer NOT NULL, "amount" integer NOT NULL, CONSTRAINT "PK_1fb72f1a792918a67594f65ed15" PRIMARY KEY ("id", "user_id", "product_id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "users_products" ADD CONSTRAINT "FK_aa5b428cf886fba759ac5ab6a22" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "users_products" ADD CONSTRAINT "FK_8df53173c3d4ac948b256d5c146" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users_products" DROP CONSTRAINT "FK_8df53173c3d4ac948b256d5c146"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users_products" DROP CONSTRAINT "FK_aa5b428cf886fba759ac5ab6a22"`,
    );
    await queryRunner.query(`DROP TABLE "users_products"`);
    await queryRunner.query(`DROP TABLE "products"`);
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
