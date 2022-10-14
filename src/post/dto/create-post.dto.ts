import { IsNotEmpty, MaxLength, MinLength } from "class-validator";

export class CreatePostDto {
    @IsNotEmpty()
    @MinLength(5)
    @MaxLength(20)
    title: string;

    @IsNotEmpty()
    @MinLength(5)
    @MaxLength(100)
    description: string;

    userId?: string;
}
