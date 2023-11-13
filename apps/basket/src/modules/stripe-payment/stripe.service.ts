import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { ResponsePurchaseInfo } from '@libs/common';

import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private readonly stripe: Stripe;

  constructor(private readonly config: ConfigService) {
    this.stripe = new Stripe(this.config.get('STRIPE_PRIVATE_KEY'), {
      apiVersion: this.config.get('STRIPE_API_VERSION'),
    });
  }

  async createCheckoutSession(purchaseInfo: ResponsePurchaseInfo) {
    const session = await this.stripe.checkout.sessions.create({
      currency: purchaseInfo.currency,
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: purchaseInfo.products.map((productInfo) => {
        return {
          price_data: {
            currency: purchaseInfo.currency,
            product_data: {
              name: productInfo.commonInfo.title,
            },
            unit_amount: productInfo.commonInfo.price * 100,
          },
          quantity: productInfo.amount,
        };
      }),
      success_url: this.config.get('SUCCESS_URL'),
      cancel_url: this.config.get('CANCEL_URL'),
    });

    return { url: session.url };
  }
}
