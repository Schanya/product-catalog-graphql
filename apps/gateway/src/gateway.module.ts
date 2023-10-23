import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloGatewayDriver, ApolloGatewayDriverConfig } from '@nestjs/apollo';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { IntrospectAndCompose } from '@apollo/gateway';

import { GatewayController } from './gateway.controller';
import { GatewayService } from './gateway.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { KafkaModule } from '@libs/libs';

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
      },
    }),
    inject: [ConfigService],
  });

const DefinitionKafkaClient = ClientsModule.register([
  {
    name: 'CATALOG_SERVICE',
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'catalog',
        brokers: ['localhost:9092'],
      },
      consumer: {
        groupId: 'catalog-consumer',
      },
    },
  },
]);

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/gateway/.env',
    }),
    KafkaModule.register({
      name: 'CATALOG',
    }),
  ],
  controllers: [GatewayController],
  providers: [GatewayService],
})
export class GatewayModule {}
