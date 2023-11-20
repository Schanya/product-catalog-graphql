import { DataSourceOptions } from 'typeorm';
import { Product } from '../products/entities';

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_DB_HOST,
  port: Number.parseInt(process.env.POSTGRES_DB_PORT, 10),
  username: process.env.POSTGRES_DB_USERNAME,
  password: process.env.POSTGRES_DB_PASSWORD,
  database: process.env.POSTGRES_DB_NAME,
  entities: [Product],
  migrations: ['./apps/catalog/migrations/*.ts'],
  migrationsRun: true,
  synchronize: false,
};
