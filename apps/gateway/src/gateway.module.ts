import { ApolloGatewayDriver, ApolloGatewayDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';

import { IntrospectAndCompose, RemoteGraphQLDataSource } from '@apollo/gateway';

import { KafkaModule } from '@libs/common';
import { GatewayController } from './gateway.controller';
import { GatewayService } from './gateway.service';

const DefinitionGraphQLModule =
  GraphQLModule.forRootAsync<ApolloGatewayDriverConfig>({
    imports: [ConfigModule],
    driver: ApolloGatewayDriver,
    useFactory: (config: ConfigService) => ({
      server: {},
      gateway: {
        supergraphSdl: new IntrospectAndCompose({
          subgraphHealthCheck: true,
          subgraphs: [
            {
              name: config.get<string>('CATALOG_NAME'),
              url: config.get<string>('CATALOG_URL'),
            },
          ],
        }),
        buildService({ url }) {
          return new RemoteGraphQLDataSource({
            url,
            willSendRequest({ request, context }) {
              request.http.headers.set('authorization', context.authorization);
            },
          });
        },
      },
    }),
    inject: [ConfigService],
  });

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/gateway/.env',
    }),
    KafkaModule.register({
      name: 'CATALOG',
    }),
    DefinitionGraphQLModule,
  ],
  controllers: [GatewayController],
  providers: [GatewayService],
})
export class GatewayModule {}
