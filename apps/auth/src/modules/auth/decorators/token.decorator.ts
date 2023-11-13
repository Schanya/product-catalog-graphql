import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const TokensFromRequest = createParamDecorator(
  (data: any, ctx: ExecutionContext) => {
    const gqlContext = GqlExecutionContext.create(ctx);
    const request = gqlContext.getContext().req;

    const tokens = request?.cookies['auth-cookie'];

    if (!tokens) {
      return null;
    }

    if (data) {
      return tokens[data];
    }

    return tokens;
  },
);
