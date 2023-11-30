import { ApolloGatewayDriver, ApolloGatewayDriverConfig } from '@nestjs/apollo';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';

import {
  AllExceptionFilter,
  JwtStrategy,
  LoggerMiddleware,
  WinstonLoggerModule,
} from '@libs/common';

import { graphqlFederationOptions } from './configs';

import { CoreModule } from './modules/core.module';

const DefinitionGraphQLModule =
  GraphQLModule.forRootAsync<ApolloGatewayDriverConfig>({
    imports: [ConfigModule],
    driver: ApolloGatewayDriver,
    useFactory: graphqlFederationOptions,
    inject: [ConfigService],
  });

const DefinitionConfigModule = ConfigModule.forRoot({
  isGlobal: true,
  envFilePath: './apps/gateway/.env',
});

@Module({
  imports: [
    DefinitionConfigModule,
    DefinitionGraphQLModule,
    WinstonLoggerModule,
    CoreModule,
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
export class GatewayModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
