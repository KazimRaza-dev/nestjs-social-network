import { IsEmail, IsIn, IsNotEmpty } from "class-validator";

const validUsers = ['user', 'moderator']

export class LoginUserDto {
    @IsEmail()
    email: string;

    @IsNotEmpty()
    password: string;

    @IsNotEmpty()
    @IsIn(validUsers)
    role: string;
}
