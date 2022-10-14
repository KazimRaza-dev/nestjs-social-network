import { IsEmail, IsIn, IsNotEmpty, Matches } from "class-validator";

const validUsers = ['user', 'moderator']

export class CreateUserDto {

    @IsEmail()
    email: string;

    @IsNotEmpty()
    @Matches('^[a-zA-Z0-9]{6,30}$')
    password: string;

    @IsNotEmpty()
    fname: string;

    @IsNotEmpty()
    lname: string;

    @IsNotEmpty()
    @Matches('^[+92]{3}[0-9]{10}$')
    phoneNo: string;

    @IsNotEmpty()
    @IsIn(validUsers)
    role: string;

    following: string[];
}
