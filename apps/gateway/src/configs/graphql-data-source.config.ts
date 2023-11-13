import { RemoteGraphQLDataSource } from '@apollo/gateway';
import { GraphQLDataSourceRequestKind } from '@apollo/gateway/dist/datasources/types';

export class GraphQLDataSource extends RemoteGraphQLDataSource {
  didReceiveResponse({ response, request, context }): typeof response {
    const cookies = response.http.headers?.raw()['auth-cookie'] as
      | string[]
      | null;

    if (cookies) {
      context?.req.res.append('auth-cookie', cookies);
    }

    return response;
  }

  willSendRequest({ request, kind, context }) {
    if (kind === GraphQLDataSourceRequestKind.INCOMING_OPERATION) {
      const cookie = context.request.http.headers.get('Cookie');

      request.http.headers.set('Cookie', cookie);
    }
  }
}
