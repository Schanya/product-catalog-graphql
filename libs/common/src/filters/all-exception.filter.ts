import {
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { ApolloError } from 'apollo-server-express';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  catch(exception: any) {
    if (exception instanceof HttpException) {
      const status = exception.getStatus();

      throw new ApolloError(exception.message, `${status}`);
    }

    if (exception instanceof RpcException) {
      throw new ApolloError(exception.message);
    }

    const status = HttpStatus.INTERNAL_SERVER_ERROR;
    throw new ApolloError(exception.message, `${status}`);
  }
}
