import { IsEmail, IsIn, IsNotEmpty } from "class-validator";

const validUsers = ['user', 'moderator']

export class ReqUserDto {

    id: string;

    @IsEmail()
    email: string;

    @IsIn(validUsers)
    role: string;
}
