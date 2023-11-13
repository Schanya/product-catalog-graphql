import { IntrospectAndCompose } from '@apollo/gateway';
import { ApolloGatewayDriverConfig } from '@nestjs/apollo';
import { ConfigService } from '@nestjs/config';
import { GraphQLDataSource } from './graphql-data-source.config';

export const graphqlFederationOptions = (
  config: ConfigService,
): Omit<ApolloGatewayDriverConfig<any>, 'driver'> => ({
  server: {},
  gateway: {
    supergraphSdl: new IntrospectAndCompose({
      subgraphHealthCheck: true,
      subgraphs: [
        {
          name: config.get<string>('CATALOG_NAME'),
          url: config.get<string>('CATALOG_URL'),
        },
        {
          name: config.get<string>('AUTH_NAME'),
          url: config.get<string>('AUTH_URL'),
        },
      ],
    }),
    buildService: (args) => new GraphQLDataSource(args),
  },
});
