import { IsEmail, IsIn, IsNotEmpty } from "class-validator";

const validUsers = ['user', 'moderator']

export class ReqUserDto {

    @IsNotEmpty()
    id: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsIn(validUsers)
    role: string;
}
