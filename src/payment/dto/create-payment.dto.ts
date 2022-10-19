import { IsEmail, IsNotEmpty } from "class-validator";

export class CreatePaymentDto {
    @IsNotEmpty()
    stripeId: string;

    @IsNotEmpty()
    @IsEmail()
    paymentEmail: string;

    @IsNotEmpty()
    paymentName: string;

    @IsNotEmpty()
    status: string;

    @IsNotEmpty()
    currency: string;

    @IsNotEmpty()
    amountPaid: number;

    @IsNotEmpty()
    method: string;

    @IsNotEmpty()
    userId: string;
}