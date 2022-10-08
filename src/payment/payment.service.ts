import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import Stripe from 'stripe';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { Payment, PaymentDocument } from './schema/payment.schema';

const stripe = new Stripe("sk_test_51Ljzs8ANwplLurwbt5nomoWTZVnV9935soRAuEoEi7SW3OY5KSxU7WWnM1MHpaG1I2hI6QoIUp3oXVd71eOWVDIR001rPmgFCh", {
  apiVersion: '2022-08-01'
});

@Injectable()
export class PaymentService {
  constructor(@InjectModel(Payment.name) private paymentModel: Model<PaymentDocument>) { }

  async makePayment(userId: string) {
    const alreadyPaid = await this.isAlreadyPaid(userId);
    if (alreadyPaid) {
      return { message: "You have already paid for social Feed." }
    }
    const price = 1200;
    const session = await this.createStripeSession(userId, price);
    return { url: session.url }
  }

  async isAlreadyPaid(userId: string) {
    return this.paymentModel.findOne({ userId: userId });
  }

  async createStripeSession(userId: string, price: number) {
    try {
      const session = await stripe.checkout.sessions.create({
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

  async paymentSuccess(userId: string, sessionId: string) {
    const session = await stripe.checkout.sessions.retrieve(sessionId)
    const paymentSuccess = await this.createPayment(session, userId)
    if (paymentSuccess) {
      return { message: "Payment succeed. Now you can enjoy social feed." }
    }
    throw new BadRequestException()
  }

  paymentFailed() {
    throw new BadRequestException("Payment failed. Make correct payment in order to access social feed.");
  }

  async createPayment(session, userId: string) {
    const newPayment: CreatePaymentDto = {
      stripeId: session.id, paymentEmail: session.customer_details.email,
      paymentName: session.customer_details.name, method: session.payment_method_types[0],
      status: session.payment_status, currency: session.currency, amountPaid: session.amount_total / 100, userId: userId
    };
    const payment = new this.paymentModel(newPayment);
    return payment.save();
  }

}
