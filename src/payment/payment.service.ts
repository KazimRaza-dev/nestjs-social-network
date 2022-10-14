import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import Stripe from 'stripe';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { Payment, PaymentDocument } from './schema/payment.schema';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PaymentService {
  private stripe: Stripe;

  constructor(
    @InjectModel(Payment.name) private paymentModel: Model<PaymentDocument>,
    private configService: ConfigService
  ) {
    this.stripe = new Stripe(configService.get('STRIPE_SECRET_KEY'), {
      apiVersion: '2022-08-01'
    });
  }

  /**
   * Generate stripe checkout URL for making payment
   * 
   * @param userId Id of user making the payment
   * @returns Stripe checkout url after creating stripe session
   */
  async makePayment(userId: string) {
    const alreadyPaid = await this.isAlreadyPaid(userId);
    if (alreadyPaid) {
      return { message: "You have already paid for social Feed." }
    }
    const price = 1200;
    const session = await this.createStripeSession(userId, price);
    return { url: session.url }
  }

  /**
   * Check if particular user has already paid or not
   * 
   * @param userId Id of user
   * @returns Payment object if the user has already paid
   */
  async isAlreadyPaid(userId: string) {
    return this.paymentModel.findOne({ userId: userId });
  }

  /**
   * Create stripe session object to payment
   * 
   * @param userId Id of user
   * @param price Amount of money to pay
   * @returns Session object after assigning its parameters
   */
  async createStripeSession(userId: string, price: number) {
    try {
      const session = await this.stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment',
        line_items: [
          {
            price_data: {
              currency: "USD",
              product_data: {
                name: "Payment for Social Feed",
              },
              unit_amount: price,
            },
            quantity: 1,
          }
        ],
        success_url: `${process.env.STRIPE_SERVER_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}&userId=${userId}`,
        cancel_url: `${process.env.STRIPE_SERVER_URL}/payment/failure`
      });
      return session;
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  /**
   * Store payment records in database
   *  
   * @param userId If of user making payment
   * @param sessionId Session object Id after making payment
   * @returns Success message after storing payment records in database
   */
  async paymentSuccess(userId: string, sessionId: string) {
    if (!userId) {
      throw new ForbiddenException('You need to make payment first.')
    }
    const session = await this.stripe.checkout.sessions.retrieve(sessionId)
    const paymentSuccess = await this.savePayment(session, userId)
    if (paymentSuccess) {
      return { message: "Payment succeed. Now you can enjoy social feed." }
    }
    throw new BadRequestException()
  }

  /**
   * Show error message to user if payment failed
   */
  paymentFailed() {
    throw new BadRequestException("Payment failed. Make correct payment in order to access social feed.");
  }

  /**
   * Store a new payment in database
   * 
   * @param session Session object
   * @param userId Id of user making payment
   * @returns Payment object after storing data in DB
   */
  async savePayment(session, userId: string) {
    const newPayment: CreatePaymentDto = {
      stripeId: session.id, paymentEmail: session.customer_details.email,
      paymentName: session.customer_details.name, method: session.payment_method_types[0],
      status: session.payment_status, currency: session.currency, amountPaid: session.amount_total / 100, userId: userId
    };
    const payment = new this.paymentModel(newPayment);
    return payment.save();
  }

}
