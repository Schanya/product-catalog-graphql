import {
  ApolloFederationDriver,
  ApolloFederationDriverConfig,
} from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';

import { typeOrmOptions } from './configs';

import { AllExceptionFilter, KafkaModule } from '@libs/common';
import { APP_FILTER } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { CoreModule } from './modules/core.module';

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
  envFilePath: './apps/basket/.env',
});

const DefinitionMongoModule = MongooseModule.forRootAsync({
  imports: [ConfigModule],
  useFactory: (config: ConfigService) => ({
    uri: config.get('MONGO_DB_CONNECTION'),
    dbName: 'basket_db',
  }),
  inject: [ConfigService],
});

@Module({
  imports: [
    DefinitionTypeOrmModule,
    DefinitionConfigModule,
    DefinitionGraphQLModule,
    DefinitionMongoModule,
    CoreModule,
    KafkaModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionFilter,
    },
  ],
})
export class AppModule {}
