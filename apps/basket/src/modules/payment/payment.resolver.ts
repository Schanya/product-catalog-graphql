import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';

import { JwtAuthGuard, JwtPayloadInput, UserParam } from '@libs/common';

import { PaymentService } from './payment.service';
import { CreatePurchaseInput } from './dto';
import { Payment } from './responses';

@UseGuards(JwtAuthGuard)
@Resolver('Payment')
export class PaymentResolver {
  constructor(private readonly paymentService: PaymentService) {}

  @Mutation(() => Payment, { name: 'purchase' })
  async purchase(
    @Args('input') createPurchaseInput: CreatePurchaseInput,
    @UserParam() payload: JwtPayloadInput,
  ): Promise<Payment> {
    const url = await this.paymentService.purchase(
      createPurchaseInput,
      payload.id,
    );

    return url;
  }
}
