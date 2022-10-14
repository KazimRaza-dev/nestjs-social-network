import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/user/schema/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { passwordHashing } from './utils/hashPassword.utils';
import { Response } from "./dto/response.dto";

@Injectable()
export class AuthService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) { }

  /**
   * Register a new user And return JWT Access token to that user
   * 
   * @param createUserDto User object passed in request body
   * @returns Sucess Message and JWT access token if the user successfully registered
   */
  async register(createUserDto: CreateUserDto): Promise<Response> {
    try {
      createUserDto.password = await passwordHashing.generateHash(createUserDto.password)
      const createdUser = new this.userModel(createUserDto);
      const user = await createdUser.save();
      const payload = { id: user._id, email: user.email, role: user.role };
      return {
        message: 'User Registered.',
        access_token: this.jwtService.sign(payload),
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  /**
   * Generate JWT access access token
   * 
   * @param user user object after validating the credientials
   * @returns Success message and jwt access token.
   */
  async login(user: any): Promise<Response> {
    const payload = { id: user._id, email: user.email, role: user.role };
    return {
      message: 'User successfully logged In',
      access_token: this.jwtService.sign(payload),
    };

  }

  /**
   * Validate login credientials of a user
   * 
   * @param userEmail Email of user
   * @param userPassword Password of user
   * @returns User object if successfully login.
   */
  async validateUser(userEmail: string, userPassword: string): Promise<any> {
    const user = await this.userModel.findOne({ email: userEmail })
    if (user) {
      const isPasswordCorrect = await passwordHashing.comparePassword(userPassword, user.password);
      if (isPasswordCorrect) {
        return user;
      }
    }
    return null;
  }
}
