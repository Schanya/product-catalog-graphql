import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const UserParam = createParamDecorator(
  (data: any, ctx: ExecutionContext) => {
    const gqlContext = GqlExecutionContext.create(ctx);
    const req = gqlContext.getContext().req;

    if (!req.user) {
      return null;
    }

    if (data) {
      return req.user[data];
    }

    return req.user;
  },
);
