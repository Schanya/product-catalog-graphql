import { RemoteGraphQLDataSource } from '@apollo/gateway';
import {
  GraphQLDataSourceProcessOptions,
  GraphQLDataSourceRequestKind,
} from '@apollo/gateway/dist/datasources/types';

export class GraphQLDataSource extends RemoteGraphQLDataSource {
  didReceiveResponse({ response, context }): typeof response {
    const cookies = response.http.headers?.raw()['auth-cookie'] as
      | string[]
      | null;

    if (cookies) {
      context?.req.res.append('auth-cookie', cookies);
    }

    return response;
  }

  willSendRequest(params: GraphQLDataSourceProcessOptions) {
    const { request, kind } = params;

    if (kind === GraphQLDataSourceRequestKind.INCOMING_OPERATION) {
      const cookie =
        params?.incomingRequestContext.request.http.headers.get('Cookie');
      request.http.headers.set('Cookie', cookie);
    }
  }
}
