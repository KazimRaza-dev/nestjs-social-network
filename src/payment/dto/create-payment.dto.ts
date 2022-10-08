import mongoose from "mongoose";

export class CreatePaymentDto {
    stripeId: string;
    paymentEmail: string;
    paymentName: string;
    status: string;
    currency: string;
    amountPaid: number;
    method: string;
    userId: string;
}