import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmOptions = (
  config: ConfigService,
): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: config.get('POSTGRES_DB_HOST'),
  port: config.get<number>('POSTGRES_DB_PORT'),
  username: config.get('POSTGRES_DB_USERNAME'),
  password: config.get('POSTGRES_DB_PASSWORD'),
  database: config.get('POSTGRES_DB_NAME'),
  migrations: ['apps/auth/migrations/*.ts'],
  synchronize: true,
  autoLoadEntities: true,
  logging: true,
});
