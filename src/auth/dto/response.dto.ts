import { IsNotEmpty } from "class-validator";

export class Response {
    @IsNotEmpty()
    message: string;

    @IsNotEmpty()
    access_token: string;
}