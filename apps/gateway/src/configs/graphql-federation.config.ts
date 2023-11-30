import { IntrospectAndCompose } from '@apollo/gateway';
import { ConfigService } from '@nestjs/config';
import { GraphQLDataSource } from './graphql-data-source.config';

export const graphqlFederationOptions = (config: ConfigService) => ({
  server: {},
  cors: {
    origin: true,
    credentials: true,
  },
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
        {
          name: config.get<string>('BASKET_NAME'),
          url: config.get<string>('BASKET_URL'),
        },
        {
          name: config.get<string>('ORDER_NAME'),
          url: config.get<string>('ORDER_URL'),
        },
      ],
    }),
    buildService: (args) => new GraphQLDataSource(args),
  },
});
