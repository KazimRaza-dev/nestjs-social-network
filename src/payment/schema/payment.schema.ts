import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from 'mongoose';
import { User } from "src/user/schema/user.schema";

export type PaymentDocument = Payment & Document;

@Schema({ timestamps: true })
export class Payment {
    @Prop({ required: true, type: String })
    stripeId: string;

    @Prop({ required: true, type: String })
    paymentEmail: string;

    @Prop({ required: true, type: String })
    paymentName: string;

    @Prop({ required: true, type: String })
    status: string;

    @Prop({ required: true, type: String })
    currency: string;

    @Prop({ required: true, type: Number })
    amountPaid: string;

    @Prop({ required: true, type: String })
    method: string;

    @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    userId: User;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);