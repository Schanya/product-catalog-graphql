import { ApolloGatewayDriver, ApolloGatewayDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';

import { KafkaModule } from '@libs/common';
import { graphqlFederationOptions } from './configs';
import { GatewayController } from './gateway.controller';
import { GatewayService } from './gateway.service';

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

const DefinitionKafkaModule = KafkaModule.register({
  name: 'CATALOG',
});

@Module({
  imports: [
    DefinitionConfigModule,
    DefinitionKafkaModule,
    DefinitionGraphQLModule,
  ],
  controllers: [GatewayController],
  providers: [GatewayService],
})
export class GatewayModule {}
