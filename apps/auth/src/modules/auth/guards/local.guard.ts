import { ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);

    const gqlReq = ctx.getContext().req;
    const { input } = ctx.getArgs();
    const { email, password } = input;

    gqlReq.body.email = email;
    gqlReq.body.password = password;

    return gqlReq;
  }
}
