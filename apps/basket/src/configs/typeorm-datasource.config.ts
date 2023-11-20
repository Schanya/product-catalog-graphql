import { DataSourceOptions } from 'typeorm';
import { Product } from '../modules/product/entities';
import { User } from '../modules/user/entities';
import { UsersProducts } from '../modules/user-product/entities';

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_DB_HOST,
  port: Number.parseInt(process.env.POSTGRES_DB_PORT, 10),
  username: process.env.POSTGRES_DB_USERNAME,
  password: process.env.POSTGRES_DB_PASSWORD,
  database: process.env.POSTGRES_DB_NAME,
  entities: [Product, User, UsersProducts],
  migrations: ['./apps/basket/migrations/*.ts'],
  migrationsRun: true,
  synchronize: false,
};
