import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { MongooseModule } from '@nestjs/mongoose';

import {
  ApolloFederationDriver,
  ApolloFederationDriverConfig,
} from '@nestjs/apollo';

import {
  AllExceptionFilter,
  JwtStrategy,
  KafkaModule,
  LoggerMiddleware,
  WinstonLoggerModule,
  getEnvironmentFile,
} from '@libs/common';
import { CoreModule } from './modules/core.module';

const envFilePath = `./apps/order/${getEnvironmentFile(process.env.NODE_ENV)}`;
const DefinitionConfigModule = ConfigModule.forRoot({
  isGlobal: true,
  envFilePath: envFilePath,
});

const DefinitionMongoModule = MongooseModule.forRootAsync({
  imports: [ConfigModule],
  useFactory: (config: ConfigService) => ({
    uri: config.get('MONGO_DB_CONNECTION'),
    dbName: 'order_db',
  }),
  inject: [ConfigService],
});

const DefinitionGraphQLModule =
  GraphQLModule.forRoot<ApolloFederationDriverConfig>({
    driver: ApolloFederationDriver,
    typePaths: ['**/*.graphql'],
  });

@Module({
  imports: [
    DefinitionConfigModule,
    DefinitionGraphQLModule,
    DefinitionMongoModule,
    CoreModule,
    KafkaModule,
    WinstonLoggerModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionFilter,
    },
    JwtStrategy,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
