import { DataSourceOptions } from 'typeorm';

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_DB_HOST,
  port: Number.parseInt(process.env.POSTGRES_DB_PORT, 10),
  username: process.env.POSTGRES_DB_USERNAME,
  password: process.env.POSTGRES_DB_PASSWORD,
  database: process.env.POSTGRES_DB_NAME,
  entities: ['./apps/basket/src/modules/**/entities/*.entity.ts'],
  migrations: ['./apps/basket/src/migrations/*.ts'],
  migrationsRun: true,
  synchronize: false,
};
