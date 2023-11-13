import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const TransactionParam = createParamDecorator(
  (data: any, context: ExecutionContext) => {
    const gqlContext = GqlExecutionContext.create(context);
    const req = gqlContext.getContext().req;

    return req['transaction'];
  },
);
