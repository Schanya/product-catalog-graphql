import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { getEnvironmentFile } from '@libs/common';
import { CoreModule } from '../src/modules/core.module';
import { Token } from '../src/modules/jwt/entities';
import { User } from '../src/modules/users/entities';

const envFilePath = `./apps/auth/${getEnvironmentFile(process.env.NODE_ENV)}`;
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: envFilePath,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('POSTGRES_DB_HOST'),
        port: configService.get<number>('POSTGRES_DB_PORT'),
        username: configService.get('POSTGRES_DB_USERNAME'),
        password: configService.get('POSTGRES_DB_PASSWORD'),
        database: configService.get('POSTGRES_DB_NAME'),
        entities: [User, Token],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    CoreModule,
  ],
})
export class TestDatabaseModule {}
