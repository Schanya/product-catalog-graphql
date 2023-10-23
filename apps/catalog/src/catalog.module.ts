import { Module } from '@nestjs/common';
import { CatalogController } from './catalog.controller';
import { CatalogService } from './catalog.service';
import { ProductsModule } from './products/products.module';
import { KafkaModule } from '@libs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import {
  ApolloFederationDriver,
  ApolloFederationDriverConfig,
} from '@nestjs/apollo';
import { TypeOrmModule } from '@nestjs/typeorm';

const DefinitionGraphQLModule =
  GraphQLModule.forRoot<ApolloFederationDriverConfig>({
    driver: ApolloFederationDriver,
    autoSchemaFile: {
      federation: 2,
    },
  });

const DefinitionTypeOrmModule = TypeOrmModule.forRootAsync({
  imports: [ConfigModule],
  useFactory: (config: ConfigService) => ({
    type: 'postgres',
    host: config.get('POSTGRES_DB_HOST'),
    port: config.get<number>('POSTGRES_DB_PORT'),
    username: config.get('POSTGRES_DB_USERNAME'),
    password: config.get('POSTGRES_DB_PASSWORD'),
    database: config.get('POSTGRES_DB_NAME'),
    entities: ['dist/**/*{.entity.js, .entity.ts}'],
    migrations: ['dist/data/migrations/*.js'],
    synchronize: true,
    autoLoadEntities: true,
    logging: true,
  }),
  inject: [ConfigService],
});

@Module({
  imports: [
    DefinitionTypeOrmModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/catalog/.env',
    }),
    ProductsModule,
    KafkaModule,
    DefinitionGraphQLModule,
  ],
  controllers: [CatalogController],
  providers: [CatalogService],
})
export class CatalogModule {}
