import { IntrospectAndCompose, RemoteGraphQLDataSource } from '@apollo/gateway';
import { ApolloGatewayDriverConfig } from '@nestjs/apollo';
import { ConfigService } from '@nestjs/config';

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
    buildService({ url }) {
      return new RemoteGraphQLDataSource({
        url,
        willSendRequest({ request, context }) {
          request.http.headers.set('authorization', context.authorization);
        },
      });
    },
  },
});
