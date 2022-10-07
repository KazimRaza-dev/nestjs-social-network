import { Controller, Post, Body, Res, UsePipes } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { Response } from "express";
import { registerUserSchema } from './joi-schemas/registerUser.schema';
import { loginUserSchema } from './joi-schemas/loginUser.schema';
import { JoiValidationPipe } from './pipes/validation.pipe';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  @UsePipes(new JoiValidationPipe(registerUserSchema))
  async register(@Body() createUserDto: CreateUserDto, @Res() res: Response): Promise<void> {
    const jwtAccessToken = await this.authService.register(createUserDto);

    res.status(200).header('x-auth-token', jwtAccessToken).send({
      message: "User successfully Registered."
    });
  }

  @Post('login')
  @UsePipes(new JoiValidationPipe(loginUserSchema))
  async login(@Body() loginUser: LoginUserDto, @Res() res: Response): Promise<void> {
    const jwtAccessToken = await this.authService.login(loginUser);

    res.status(200).header('x-auth-token', jwtAccessToken).send({
      message: "User successfully log In."
    });
  }


}
