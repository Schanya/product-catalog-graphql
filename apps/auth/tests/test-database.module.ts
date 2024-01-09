import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from '../src/modules/users/entities';
import { Token } from '../src/modules/jwt/entities';
import { CoreModule } from '../src/modules/core.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `./apps/auth/.env`,
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
