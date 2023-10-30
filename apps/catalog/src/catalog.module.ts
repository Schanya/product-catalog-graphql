import {
  ApolloFederationDriver,
  ApolloFederationDriverConfig,
} from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AllExceptionFilter, JwtStrategy, KafkaModule } from '@libs/common';

import { CatalogController } from './catalog.controller';
import { CatalogService } from './catalog.service';
import { typeOrmOptions } from './configs';
import { ProductsModule } from './products/products.module';

const DefinitionGraphQLModule =
  GraphQLModule.forRoot<ApolloFederationDriverConfig>({
    driver: ApolloFederationDriver,
    context: ({ req, res }) => ({ req, res }),
    autoSchemaFile: {
      federation: 2,
    },
  });

const DefinitionTypeOrmModule = TypeOrmModule.forRootAsync({
  imports: [ConfigModule],
  useFactory: typeOrmOptions,
  inject: [ConfigService],
});

const DefinitionConfigModule = ConfigModule.forRoot({
  isGlobal: true,
  envFilePath: './apps/catalog/.env',
});

@Module({
  imports: [
    DefinitionTypeOrmModule,
    DefinitionConfigModule,
    DefinitionGraphQLModule,
    ProductsModule,
    KafkaModule,
  ],
  controllers: [CatalogController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionFilter,
    },
    CatalogService,
    JwtStrategy,
  ],
})
export class CatalogModule {}
