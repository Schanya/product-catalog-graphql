import { DataSourceOptions } from 'typeorm';
import { Token } from '../modules/jwt/entities';
import { User } from '../modules/users/entities';

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_DB_HOST,
  port: Number.parseInt(process.env.POSTGRES_DB_PORT, 10),
  username: process.env.POSTGRES_DB_USERNAME,
  password: process.env.POSTGRES_DB_PASSWORD,
  database: process.env.POSTGRES_DB_NAME,
  entities: [Token, User],
  migrations: ['./apps/auth/migrations/*.ts'],
  migrationsRun: true,
  synchronize: false,
};
